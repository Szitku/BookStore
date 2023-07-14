using BookStoreAPI.Data;
using BookStoreAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BookStoreAPI.Interfaces
{
    public interface IValidateCredentials
    {
        string checkPasswordStrength(string password);
        Task<bool> checkEmailExistAsync(string email, DbSet<User> users);
        Task<bool> checkUserNameExistAsync(string username, DbSet<User> users);
    }
}
