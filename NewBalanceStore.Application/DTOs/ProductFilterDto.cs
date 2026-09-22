using System;
using System.Collections.Generic;
using System.Text;

namespace NewBalanceStore.Application.DTOs
{
    public class ProductFilterDto
    {
        public string? SearchTerm { get; set; }
        public string? Category { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? SortBy { get; set; }
    }
}