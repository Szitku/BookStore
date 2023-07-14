using BookStoreAPI.Models;
using System.Security.Claims;

namespace BookStoreAPI.Interfaces
{
    public interface IJwtTokenHelper
    {
        public string CreateJwtToken(User user);
        public string CreateRefreshToken(List<User> users);
        public ClaimsPrincipal GetPrincipleFromExpiredToken(string token);

    }
}
