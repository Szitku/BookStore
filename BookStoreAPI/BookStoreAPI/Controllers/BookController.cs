using BookStoreAPI.Data;
using BookStoreAPI.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly DataContext _dataContext;
        public BookController(DataContext context)
        {
            _dataContext = context;
        }



        [HttpGet]
        [Route("getBooks")]
        public async Task<IActionResult> getBooks() {
            List<Book> bookslist = await _dataContext.Books.ToListAsync();
            if (bookslist == null) {
                return BadRequest(new {Message = "Books not found!"});
            }
            return Ok(bookslist);
        }

        [HttpPost]
        [Route("addBook")]
        public async Task<IActionResult> createBook([FromBody]Book book) {
            _dataContext.Books.Add(book);
            await _dataContext.SaveChangesAsync();
            return Ok(new {Message = "Book was added!" });
        }

        [HttpPut]
        [Route("updateBook")]
        public async Task<IActionResult> updateBook(Book book) 
        {
            Book foundBook = await _dataContext.Books.FindAsync(book.Id);
            if (foundBook == null) {
                return BadRequest(new {Message = "Book not found!"});
            }

            foundBook.Title = book.Title;
            foundBook.Author = book.Author;
            foundBook.Cover = book.Cover;
            foundBook.Synopsis = book.Synopsis;
            foundBook.Price = book.Price;

            await _dataContext.SaveChangesAsync();

            return Ok(new {Message = "Book was updated"});
        }

        [HttpGet]
        [Route("getBookbyId/{id}")]
        public async Task<IActionResult> getBookbyId(int id)
        {
            Book book = await _dataContext.Books.FirstOrDefaultAsync(x => x.Id == id);
            if (book == null) {
                return BadRequest(new {Message = "Book not found!"});
            }
            return Ok(book);
        }

        [HttpDelete]
        [Route("deleteBook/{id}")]
        public async Task<IActionResult> DeleteBook(int id) {
            Book foundBook = await _dataContext.Books.FindAsync(id);
            if (foundBook == null)
            {
                return BadRequest(new{ Message = "Book not found!"});
            }
            _dataContext.Books.Remove(foundBook);
            await _dataContext.SaveChangesAsync();

            return Ok(new {Message = "Book was deleted!"});
        }



    }
}
