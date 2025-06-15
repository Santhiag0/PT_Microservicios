using ProductService.Dtos;
using ProductService.Models;

namespace ProductService.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(int id);
        Task<Product> CreateAsync(ProductDto dto);
        Task<bool> UpdateAsync(int id, ProductDto dto);
        Task<bool> DeleteAsync(int id);
        Task<bool> UpdateStockAsync(int id, int newStock);

    }
}
