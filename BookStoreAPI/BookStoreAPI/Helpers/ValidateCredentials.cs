using BookStoreAPI.Data;
using BookStoreAPI.Interfaces;
using BookStoreAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace BookStoreAPI.Helpers
{
    public class ValidateCredentials : IValidateCredentials
    {
        public async Task<bool> checkEmailExistAsync(string email, DbSet<User> users)
        {
            return await users.AnyAsync(x => x.Email == email);
        }

        public async Task<bool> checkUserNameExistAsync(string username, DbSet<User> users)
        {
            return await users.AnyAsync(x => x.Username == username);
        }

        public string checkPasswordStrength(string password)
        {
            StringBuilder sb = new StringBuilder();
            if (password.Length < 8) sb.AppendLine("Minimum password length should be 8");
            if (!password.Any(char.IsDigit)) sb.AppendLine("Atleast one number");
            if (!password.Any(char.IsUpper)) sb.AppendLine("Atleast one upper character");
            if (!password.Any(IsSpecialCharacter)) sb.AppendLine("Atleast one special character");

            return sb.ToString();
        }

        private bool IsSpecialCharacter(char c)
        {
            char[] specialCharacters = { '@', '#', '$', '%', '&', '*', '-', '+' };
            return specialCharacters.Contains(c);
        }
    }
}
