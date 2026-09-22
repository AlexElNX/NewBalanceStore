using System;
using System.Collections.Generic;
using System.Text;

namespace NewBalanceStore.Domain.Entities;

public class ProductVariant
{
    public int Id { get; set; }

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string Color { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public int Quantity { get; set; }
}