using System;
using System.Collections.Generic;
using System.Text;

namespace NewBalanceStore.Application.DTOs;

public class CreateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Activity { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;

    public decimal Price { get; set; }
    public decimal? OldPrice { get; set; }
    public bool IsNew { get; set; }

    public List<string> Colors { get; set; } = new();
    public Dictionary<string, List<string>> Images { get; set; } = new();
    public List<CreateProductVariantDto> Variants { get; set; } = new();
}