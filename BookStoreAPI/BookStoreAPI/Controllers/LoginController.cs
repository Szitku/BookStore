﻿using BookStoreAPI.Data;
using BookStoreAPI.Helpers;
using BookStoreAPI.Models;
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
        public LoginController(DataContext datacontext)
        {
            _dataContext = datacontext;
        }


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
                return BadRequest(new {Message = "User not found"});
            }
            _dataContext.Users.Remove(userfound);
            _dataContext.SaveChanges();
            return Ok(new {Message = "User deleted"});

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
                user.Token = CreateJwtToken(user);
                return Ok(new
                {
                    Message = "Login sucessful!",
                    Token = user.Token
                });
            }

            return BadRequest(new
            {
                Message = "Username or password is wrong!"
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

        private string CreateJwtToken(User user) 
        {
            JwtSecurityTokenHandler jwtTokenHandler = new JwtSecurityTokenHandler();
            byte[] key = Encoding.ASCII.GetBytes("my-32-character-ultra-secure-and-ultra-long-secret");
            ClaimsIdentity identity = new ClaimsIdentity(new Claim[] {
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.Name,$"{user.FirstName} {user.LastName}")
            });

            SigningCredentials credential = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credential
            };

            SecurityToken token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);
        }

    }
}
