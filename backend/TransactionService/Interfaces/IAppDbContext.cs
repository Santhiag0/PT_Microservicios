using Microsoft.EntityFrameworkCore;
using TransactionService.Models;

namespace TransactionService.Interfaces
{
    public interface IAppDbContext
    {
        DbSet<Transaction> Transactions { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
