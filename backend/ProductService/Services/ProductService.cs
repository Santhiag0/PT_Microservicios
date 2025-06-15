using ProductService.Data;
using ProductService.Dtos;
using ProductService.Interfaces;
using ProductService.Models;
using Microsoft.EntityFrameworkCore;

namespace ProductService.Services
{
    public class ProductService : IProductService
    {
        private readonly IAppDbContext _context;

        public ProductService(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAllAsync() =>
            await _context.Products.ToListAsync();

        public async Task<Product?> GetByIdAsync(int id) =>
            await _context.Products.FindAsync(id);

        public async Task<Product> CreateAsync(ProductDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Category = dto.Category,
                ImageUrl = dto.ImageUrl,
                Price = dto.Price,
                Stock = dto.Stock
            };
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<bool> UpdateAsync(int id, ProductDto dto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Category = dto.Category;
            product.ImageUrl = dto.ImageUrl;
            product.Price = dto.Price;
            product.Stock = dto.Stock;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> UpdateStockAsync(int id, int newStock)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            product.Stock = newStock;
            await _context.SaveChangesAsync();
            return true;
        }


    }
}
