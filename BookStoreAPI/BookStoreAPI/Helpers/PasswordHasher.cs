using System.Security.Cryptography;

namespace BookStoreAPI.Helpers
{
    public class PasswordHasher
    {
        private static RNGCryptoServiceProvider rngCsp = new RNGCryptoServiceProvider();
        private static readonly int SaltSize = 16;
        private static readonly int HashSize = 20   ;
        private static readonly int Iterations = 10000;

        public static string HashPassword(string password) 
        {
            byte[] salt = new byte[SaltSize];
            Rfc2898DeriveBytes key = new Rfc2898DeriveBytes(password,salt,Iterations);
            byte[] hash = key.GetBytes(HashSize);

            byte[] hashbytes = new byte[SaltSize + HashSize];
            Array.Copy(salt, hashbytes, SaltSize);
            Array.Copy(hash,0,hashbytes,SaltSize,HashSize);

            return Convert.ToBase64String(hashbytes);
        }

        public static bool VerifyPassword(string password, string base64hash) 
        {
            byte[] hashBytes = Convert.FromBase64String(base64hash);
            byte[] salt = new byte[SaltSize];

            Array.Copy(hashBytes, salt, SaltSize);

            Rfc2898DeriveBytes key = new Rfc2898DeriveBytes(password,salt,Iterations);
            byte[] hash = key.GetBytes(HashSize);

            for (int i = 0; i < HashSize; i++)
            {
                if (hashBytes[i + SaltSize] != hash[i]) 
                {
                    return false;
                }
            }
            return true;

        }

    }
}
