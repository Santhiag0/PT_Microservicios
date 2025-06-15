using Microsoft.EntityFrameworkCore;
using ProductService.Models;

namespace ProductService.Interfaces
{
    public interface IAppDbContext
    {
        DbSet<Product> Products { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
