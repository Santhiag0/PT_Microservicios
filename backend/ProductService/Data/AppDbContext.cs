using Microsoft.EntityFrameworkCore;
using ProductService.Models;
using ProductService.Interfaces;

namespace ProductService.Data
{
    public class AppDbContext : DbContext, IAppDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Products => Set<Product>();
    }
}
