using NewBalanceStore.Application.DTOs; 
namespace NewBalanceStore.Application.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetFilteredProductsAsync(ProductFilterDto filter);
    Task<IEnumerable<ProductDto>> GetAllAsync();
    Task<ProductDto?> GetByIdAsync(string id);
    Task<ProductDto> CreateAsync(CreateProductDto dto);
    Task<bool> UpdateAsync(string id, CreateProductDto dto);
    Task<bool> DeleteAsync(string id);
}