namespace BookStoreAPI.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int FK_Book { get; set; }
        public int FK_User { get; set; }
        public int Amount { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }


    }
}
