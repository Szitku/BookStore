using BookStoreAPI.Models;

namespace BookStoreAPI.Interfaces
{
    public interface IEmailService
    {
        void SendEmail(Email emailModel);

    }
}
