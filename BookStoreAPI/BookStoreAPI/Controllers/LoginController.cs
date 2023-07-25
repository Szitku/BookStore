using BookStoreAPI.Data;
using BookStoreAPI.Helpers;
using BookStoreAPI.Interfaces;
using BookStoreAPI.Models;
using BookStoreAPI.Models.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace BookStoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly DataContext _dataContext;
        private readonly IJwtTokenHelper _jwtTokenHelper;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IValidateCredentials _validateCredentials;
        public LoginController(DataContext datacontext, IConfiguration configuration, IEmailService emailService, IJwtTokenHelper jwtTokenHelper, IPasswordHasher passwordHasher, IValidateCredentials validateCredentials)
        {
            _jwtTokenHelper = jwtTokenHelper;
            _dataContext = datacontext;
            _configuration = configuration;
            _emailService = emailService;
            _passwordHasher = passwordHasher;
            _validateCredentials = validateCredentials;
        }

        [HttpPost()]
        [Route("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] User userObj)
        {

            bool passwordok = false;
            if (userObj == null)
            {
                return BadRequest(new { Message = "There was a problem with the request" });
            }

            User user = await _dataContext.Users.FirstOrDefaultAsync(x => x.Username == userObj.Username);

            if (user != null) {
                passwordok = _passwordHasher.VerifyPassword(userObj.Password, user.Password);
            }




            if (user != null && passwordok)
            {
                user.Token = _jwtTokenHelper.CreateJwtToken(user);
                string newAcessToken = user.Token;
                string newRefreshToken = _jwtTokenHelper.CreateRefreshToken(await _dataContext.Users.ToListAsync());
                user.RefreshToken = newRefreshToken;
                user.RefreshTokenExpiryTime = DateTime.Now.AddDays(5);
                await _dataContext.SaveChangesAsync();

                return Ok(new TokenApiDto()
                {
                    AccessToken = newAcessToken,
                    RefreshToken = newRefreshToken
                });
            }

            return BadRequest(new
            {
                Message = "Username or password is wrong!"
            });



        }

        [HttpPost]
        [Route("refresh")]
        public async Task<IActionResult> RefreshToken(TokenApiDto tokenApiDto) 
        {
            if (tokenApiDto is null || tokenApiDto.AccessToken == "" && tokenApiDto.RefreshToken == "") return BadRequest(new { Message = "Invalid request" });
            string accessToken = tokenApiDto.AccessToken;
            string refreshToken = tokenApiDto.RefreshToken;

            ClaimsPrincipal principal = _jwtTokenHelper.GetPrincipleFromExpiredToken(accessToken);
            string username = principal.Identity.Name;
            User user = await _dataContext.Users.FirstOrDefaultAsync(x => x.Username == username);
            if(user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime  <= DateTime.Now)  return BadRequest(new { Message = "Invalid request"});

            string newAccessToken = _jwtTokenHelper.CreateJwtToken(user);
            string newRefreshToken = _jwtTokenHelper.CreateRefreshToken(await _dataContext.Users.ToListAsync());

            user.RefreshToken = newRefreshToken;
            await _dataContext.SaveChangesAsync();

            return Ok(new TokenApiDto() {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            });



        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> register([FromBody] User userObj)
        {
            if (userObj == null)
            {
                return BadRequest(new {Message = "There was a problem with the request" });
            }
            // Check username
            if (await _validateCredentials.checkUserNameExistAsync(userObj.Username,_dataContext.Users))
            {
                return BadRequest(new
                {
                    Message = "Username already exists!"
                });
            }
            // Check email
            if (await _validateCredentials.checkEmailExistAsync(userObj.Email,_dataContext.Users))
            {
                return BadRequest(new
                {
                    Message = "Email is used by another account"
                });
            }
            // Check password strength

            string pass = _validateCredentials.checkPasswordStrength(userObj.Password);
            if (!string.IsNullOrEmpty(pass)) 
            {
                return BadRequest(new
                {
                    Message = pass.ToString()
                });
            }


            // Registering the user
            userObj.Password = _passwordHasher.HashPassword(userObj.Password);
            userObj.Role = "User";
            userObj.Token = "";
            await _dataContext.Users.AddAsync(userObj);
            await _dataContext.SaveChangesAsync();

            return Ok(new
            {
                message = "User registered"
            });
        }
        [HttpPost("sendresetemail/{email}")]
        public async Task<IActionResult> SendEmail(string email)
        {
            User user = await _dataContext.Users.FirstOrDefaultAsync(a => a.Email == email);
            if (user == null) 
            {
                return BadRequest(new { 
                    StatusCode = 404,
                    Message = "There is no user registered with that email!"
                });
            }
            byte[] tokenBytes = RandomNumberGenerator.GetBytes(64);
            string emailToken = Convert.ToBase64String(tokenBytes);
            user.ResetPasswordToken = emailToken;
            user.ResetPasswordTokenExpiryTime = DateTime.Now.AddMinutes(15);
            string from = _configuration["EmailSettings:From"];
            Email emailModel = new Email(email, "BookStore:Reset Password", EmailBody.EmailStringBody(email,emailToken));
            _emailService.SendEmail(emailModel);
            _dataContext.Entry(user).State = EntityState.Modified;
            await _dataContext.SaveChangesAsync();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Email Sent!"
            });
        }

        [HttpPost("resetpassword")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto) 
        {
            string newToken = resetPasswordDto.EmailToken.Replace(" ", "+");
            User user = await _dataContext.Users.AsNoTracking().FirstOrDefaultAsync(a => a.Email == resetPasswordDto.Email);
            if (user == null) 
            {
                return NotFound(new { 
                    StatusCode = 404,
                    Message = "User doesn't exist"
                });
            }
            string tokenCode = user.ResetPasswordToken;
            DateTime? emailTokenExpiry = user.ResetPasswordTokenExpiryTime;
            if (tokenCode != resetPasswordDto.EmailToken || emailTokenExpiry < DateTime.Now) 
            {
                return BadRequest(new { 
                    StatusCode = 400,
                    Message = "Link is no longer valid"
                });
            }
            string passwordErrors = _validateCredentials.checkPasswordStrength(resetPasswordDto.ConfirmPassword);
            if (passwordErrors != "") 
            {
                return BadRequest(new { 
                    StatusCode = 406,
                    Message = passwordErrors
                });
            }

            user.Password = _passwordHasher.HashPassword(resetPasswordDto.NewPassword);
            user.ResetPasswordToken = null;
            user.ResetPasswordTokenExpiryTime = null;
            _dataContext.Entry(user).State = EntityState.Modified;
            await _dataContext.SaveChangesAsync();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Password change was successful"
            });
        }

        [HttpPost("resetTokenExpired")]
        public async Task<IActionResult> resetTokenExpired(ResetPasswordDto resetPasswordDto) 
        {
            string newToken = resetPasswordDto.EmailToken.Replace(" ", "+");
            User user = await _dataContext.Users.AsNoTracking().FirstOrDefaultAsync(a => a.Email == resetPasswordDto.Email);
            if (user == null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "User doesn't exist"
                });
            }
            string tokenCode = user.ResetPasswordToken;
            DateTime? emailTokenExpiry = user.ResetPasswordTokenExpiryTime;
            if (tokenCode != resetPasswordDto.EmailToken || emailTokenExpiry < DateTime.Now)
            {
                return BadRequest(new
                {
                    StatusCode = 400,
                    Message = "Link is no longer valid"
                });
            }
            else 
            {
                return Ok();
            }

        }


    }
}
