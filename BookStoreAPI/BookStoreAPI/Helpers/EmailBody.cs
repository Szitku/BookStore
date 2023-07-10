namespace BookStoreAPI.Helpers
{
    public class EmailBody
    {
        public static string EmailStringBody(string email, string emailToken) 
        {
            return $"http://localhost:4200/reset?email={email}&code={emailToken}";
        }
    }
}
