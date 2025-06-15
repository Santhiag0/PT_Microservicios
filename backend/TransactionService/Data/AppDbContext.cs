using Microsoft.EntityFrameworkCore;
using TransactionService.Models;
using TransactionService.Interfaces;

namespace TransactionService.Data
{
    public class AppDbContext : DbContext, IAppDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Transaction> Transactions => Set<Transaction>();
    }
}
