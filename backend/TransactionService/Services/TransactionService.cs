using Microsoft.EntityFrameworkCore;
using TransactionService.Dtos;
using TransactionService.Interfaces;
using TransactionService.Models;

namespace TransactionService.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly IAppDbContext _context;
        private readonly HttpClient _httpClient;

        public TransactionService(IAppDbContext context, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _httpClient = httpClientFactory.CreateClient("ProductService");
        }

        public async Task<IEnumerable<Transaction>> GetAllAsync() =>
            await _context.Transactions.ToListAsync();

        public async Task<Transaction?> GetByIdAsync(int id) =>
            await _context.Transactions.FindAsync(id);

        public async Task<Transaction> CreateAsync(TransactionDto dto)
        {
            // 1. Obtener el producto desde ProductService
            var response = await _httpClient.GetAsync($"/api/products/{dto.ProductId}");
            if (!response.IsSuccessStatusCode)
                throw new Exception("Producto no encontrado.");

            var product = await response.Content.ReadFromJsonAsync<Product>();
            if (product == null)
                throw new Exception("Producto inválido.");

            // 2. Verificar stock si es una venta
            if (dto.Type.ToLower() == "venta" && product.Stock < dto.Quantity)
                throw new Exception("Stock insuficiente para esta venta.");

            // 3. Registrar la transacción localmente
            var entity = new Transaction
            {
                Date = dto.Date,
                Type = dto.Type,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity,
                UnitPrice = dto.UnitPrice,
                Details = dto.Details
            };
            _context.Transactions.Add(entity);
            await _context.SaveChangesAsync();

            // 4. Ajustar el stock según el tipo de transacción
            int nuevoStock = dto.Type.ToLower() == "compra"
                ? product.Stock + dto.Quantity
                : product.Stock - dto.Quantity;

            product.Stock = nuevoStock;

            // 5. Actualizar solo el stock
            var stockPayload = new { stock = nuevoStock };
            var stockResponse = await _httpClient.PutAsJsonAsync($"/api/products/{product.Id}/stock", stockPayload);

            if (!stockResponse.IsSuccessStatusCode)
                throw new Exception("No se pudo actualizar el stock del producto.");

            return entity;
        }


        public async Task<bool> DeleteAsync(int id)
        {
            var t = await _context.Transactions.FindAsync(id);
            if (t == null) return false;
            _context.Transactions.Remove(t);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
