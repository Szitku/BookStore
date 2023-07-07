using BookStoreAPI.Data;
using BookStoreAPI.Helpers;
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
        private readonly JwtTokenHelper _jwtTokenHelper;
        public LoginController(DataContext datacontext)
        {
            _jwtTokenHelper = new JwtTokenHelper(datacontext);
            _dataContext = datacontext;
        }

        [Authorize]
        [HttpGet]
        [Route("getUsers")]
        public async Task<IActionResult> getUsers()
        {
            List<User> Users = await _dataContext.Users.ToListAsync();
            if (Users == null) {
                return BadRequest(new { Message = "User not found" });
            }
            return Ok(Users);
        }



        [HttpDelete]
        [Route("deleteUser/{id}")]
        public async Task<IActionResult> deleteUserbyId(int id)
        {
            User userfound = await _dataContext.Users.FindAsync(id);
            if (userfound == null) {
                return BadRequest(new { Message = "User not found" });
            }
            _dataContext.Users.Remove(userfound);
            _dataContext.SaveChanges();
            return Ok(new { Message = "User deleted" });

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
                passwordok = PasswordHasher.VerifyPassword(userObj.Password, user.Password);
            }




            if (user != null && passwordok)
            {
                user.Token = _jwtTokenHelper.CreateJwtToken(user);
                string newAcessToken = user.Token;
                string newRefreshToken = _jwtTokenHelper.CreateRefreshToken();
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
            if (tokenApiDto == null) return BadRequest(new { Message = "Invalid request" });
            string accessToken = tokenApiDto.AccessToken;
            string refreshToken = tokenApiDto.RefreshToken;

            ClaimsPrincipal principal = _jwtTokenHelper.GetPrincipleFromExpiredToken(accessToken);
            string username = principal.Identity.Name;
            User user = await _dataContext.Users.FirstOrDefaultAsync(x => x.Username == username);
            if(user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime  <= DateTime.Now)  return BadRequest(new { Message = "Invalid request"});

            string newAccessToken = _jwtTokenHelper.CreateJwtToken(user);
            string newRefreshToken = _jwtTokenHelper.CreateRefreshToken();

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
            if (await checkUserNameExistAsync(userObj.Username))
            {
                return BadRequest(new
                {
                    Message = "Username already exists!"
                });
            }
            // Check email
            if (await checkEmailExistAsync(userObj.Email))
            {
                return BadRequest(new
                {
                    Message = "Email is used by another account"
                });
            }
            // Check password strength

            string pass = checkPasswordStrengthAsync(userObj.Password);
            if (!string.IsNullOrEmpty(pass)) 
            {
                return BadRequest(new
                {
                    Message = pass.ToString()
                });
            }


            // Registering the user
            userObj.Password = PasswordHasher.HashPassword(userObj.Password);
            userObj.Role = "User";
            userObj.Token = "";
            await _dataContext.Users.AddAsync(userObj);
            await _dataContext.SaveChangesAsync();

            return Ok(new
            {
                message = "User registered"
            });
        }

        private Task<bool> checkUserNameExistAsync(string username) 
        {
            return _dataContext.Users.AnyAsync(x => x.Username == username);
        }

        private Task<bool> checkEmailExistAsync(string email)
        {
            return _dataContext.Users.AnyAsync(x => x.Email == email);
        }

        private string checkPasswordStrengthAsync(string password) 
        {
            StringBuilder sb = new StringBuilder();
            if (password.Length < 8) sb.AppendLine("Minimum password length should be 8");
            if (!password.Any(char.IsDigit)) sb.Append("Atleast one number");
            if (!password.Any(char.IsUpper)) sb.Append("Atleast one upper character");
            if (!password.Any(IsSpecialCharacter)) sb.Append("Atleast one special character");

            return sb.ToString();
        }
        private bool IsSpecialCharacter(char c)
        {
            char[] specialCharacters = { '@', '#', '$', '%', '&', '*' };
            return specialCharacters.Contains(c);
        }

        

    }
}
