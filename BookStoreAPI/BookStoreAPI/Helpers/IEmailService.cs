using BookStoreAPI.Models;

namespace BookStoreAPI.Helpers
{
    public interface IEmailService
    {
        void SendEmail(Email emailModel);

    }
}
