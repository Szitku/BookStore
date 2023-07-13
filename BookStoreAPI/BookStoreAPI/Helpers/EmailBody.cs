namespace BookStoreAPI.Helpers
{
    public class EmailBody
    {
        public static string EmailStringBody(string email, string emailToken) 
        {
            return $"<p>This link will only be active for 15 minutes</p>" +
                $"<a href=\"http://localhost:4200/reset?email={email}&code={emailToken}\">Reset password</a>";
        }
    }
}
