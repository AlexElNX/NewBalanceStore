using NewBalanceStore.Domain.Entities;
using NewBalanceStore.Domain.Enums;

namespace NewBalanceStore.Application.DTOs;

public class ProductDto : CreateProductDto
{
    public int Id { get; set; }
}