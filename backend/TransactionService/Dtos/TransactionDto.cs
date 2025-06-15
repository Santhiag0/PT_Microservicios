namespace TransactionService.Dtos
{
    public class TransactionDto
    {
        public DateTime Date { get; set; }
        public string Type { get; set; } = "";
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public string? Details { get; set; }
    }
}
