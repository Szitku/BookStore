using BookStoreAPI.Models;
using System.Security.Claims;

namespace BookStoreAPI.Helpers
{
    public interface IJwtTokenHelper
    {
        public string CreateJwtToken(User user);
        public string CreateRefreshToken();
        public ClaimsPrincipal GetPrincipleFromExpiredToken(string token);

    }
}
