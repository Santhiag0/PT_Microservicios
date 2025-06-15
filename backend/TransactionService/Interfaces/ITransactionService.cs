using TransactionService.Dtos;
using TransactionService.Models;

namespace TransactionService.Interfaces
{
    public interface ITransactionService
    {
        Task<IEnumerable<Transaction>> GetAllAsync();
        Task<Transaction?> GetByIdAsync(int id);
        Task<Transaction> CreateAsync(TransactionDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
