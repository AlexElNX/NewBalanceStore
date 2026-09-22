using System;
using System.Collections.Generic;
using System.Text;

namespace NewBalanceStore.Application.DTOs;

public class CreateProductVariantDto
{
    public string Color { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty; 
    public int Quantity { get; set; }
}