using BookStoreAPI.Data;
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
    }
}
