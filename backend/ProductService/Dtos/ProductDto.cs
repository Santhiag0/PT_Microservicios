﻿namespace ProductService.Dtos
{
    public class ProductDto
    {
        public string Name { get; set; } = "";
        public string? Description { get; set; }
        public string? Category { get; set; }
        public string? ImageUrl { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
    }
}
