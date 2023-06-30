using BookStoreAPI.Data;
using BookStoreAPI.Helpers;
using BookStoreAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
                return BadRequest("Users not found");
            }
            return Ok(Users);
        }

        [HttpDelete]
        [Route("deleteUser/{id}")]
        public async Task<IActionResult> deleteUserbyId(int id)
        {
            User userfound = await _dataContext.Users.FindAsync(id);
            if (userfound == null) {
                return BadRequest("User not found");
            }
            _dataContext.Users.Remove(userfound);
            _dataContext.SaveChanges();
            return Ok("User deleted");

        }

        [HttpPost()]
        [Route("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] User userObj)
        {
            if (userObj == null)
            {
                return BadRequest("There was a problem with the request");
            }

            User user = await _dataContext.Users.FirstOrDefaultAsync(x => x.Username == userObj.Username && x.Password == userObj.Password);
            if (user == null)
            {
                return BadRequest("User not found");
            }

            return Ok(new
            {
                Message = "Login sucessful",
                id = user.Id,
            });

        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> register([FromBody] User userObj)
        {
            if (userObj == null)
            {
                return BadRequest("There was a problem with the request");
            }
            
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
    }
}
