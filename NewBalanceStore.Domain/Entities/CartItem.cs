using System;
using System.Collections.Generic;
using System.Text;

namespace NewBalanceStore.Domain.Entities;

public class CartItem
{
    public string ProductId { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public int Quantity { get; set; }
}
