using AutoMapper;
using NewBalanceStore.Application.DTOs;
using NewBalanceStore.Application.Interfaces;
using NewBalanceStore.Domain.Entities;
using NewBalanceStore.Domain.Interfaces;

namespace NewBalanceStore.Application.Services;

/// <summary>
/// Реалізація сервісу управління товарами інтернет-магазину.
/// Виконує обробку запитів фільтрації, сортування та CRUD-операцій,
/// інкапсулюючи мапінг між доменними сутностями <see cref="Product"/> та об'єктами передачі даних (DTO).
/// </summary>
public class ProductService : IProductService
{
    private readonly IProductRepository _repository;

    /// <summary>
    /// Ініціалізує новий екземпляр класу <see cref="ProductService"/> із впровадженням репозиторію товарів.
    /// </summary>
    /// <param name="repository">Репозиторій для роботи зі сховищем товарів.</param>
    public ProductService(IProductRepository repository)
    {
        _repository = repository;
    }

    /// <summary>
    /// Отримує всі товари з репозиторію та мапить їх у колекцію DTO.
    /// </summary>
    /// <returns>Перелік товарів у вигляді <see cref="ProductDto"/>.</returns>
    public async Task<IEnumerable<ProductDto>> GetAllAsync()
    {
        var products = await _repository.GetAllAsync();
        return products.Select(MapToDto);
    }

    /// <summary>
    /// Знаходить товар за його рядковим ідентифікатором та повертає його DTO.
    /// </summary>
    /// <param name="id">Ідентифікатор товару.</param>
    /// <returns>Об'єкт <see cref="ProductDto"/> або <c>null</c>, якщо запис відсутній.</returns>
    public async Task<ProductDto?> GetByIdAsync(string id)
    {
        var product = await _repository.GetByIdAsync(id);
        return product == null ? null : MapToDto(product);
    }

    /// <summary>
    /// Створює новий товар на основі наданого DTO, генерує сутність та передає її репозиторію.
    /// </summary>
    /// <param name="dto">Вхідні дані нового товару.</param>
    /// <returns>Створений товар у форматі <see cref="ProductDto"/>.</returns>
    public async Task<ProductDto> CreateAsync(CreateProductDto dto)
    {
        var product = MapToEntity(dto);
        await _repository.CreateAsync(product);
        return MapToDto(product);
    }

    /// <summary>
    /// Оновлює дані існуючого товару.
    /// Якщо товар знайдено, його властивості перезаписуються новими значеннями з збереженням ID.
    /// </summary>
    /// <param name="id">Ідентифікатор товару для оновлення.</param>
    /// <param name="dto">Нові значення властивостей товару.</param>
    /// <returns><c>true</c>, якщо оновлення відбулося успішно; <c>false</c>, якщо товар не знайдено.</returns>
    public async Task<bool> UpdateAsync(string id, CreateProductDto dto)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null) return false;

        var productToUpdate = MapToEntity(dto);
        if (int.TryParse(id, out int parsedId))
        {
            productToUpdate.Id = parsedId;
        }

        await _repository.UpdateAsync(productToUpdate);
        return true;
    }

    /// <summary>
    /// Видаляє товар із каталогу за його ідентифікатором, якщо він існує.
    /// </summary>
    /// <param name="id">Ідентифікатор товару.</param>
    /// <returns><c>true</c>, якщо товар знайдено та видалено; інакше <c>false</c>.</returns>
    public async Task<bool> DeleteAsync(string id)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null) return false;

        await _repository.DeleteAsync(id);
        return true;
    }

    /// <summary>
    /// Застосовує фільтрацію, повнотекстовий пошук за підрядком у назві/описі
    /// та впорядкування списку товарів згідно з переданими параметрами.
    /// </summary>
    /// <param name="filter">Параметри пошуку, цінових меж, категорії та критеріїв сортування.</param>
    /// <returns>Відфільтрована та відсортована вибірка товарів.</returns>
    public async Task<IEnumerable<ProductDto>> GetFilteredProductsAsync(ProductFilterDto filter)
    {
        var products = (await _repository.GetAllAsync()).AsEnumerable();

        if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
        {
            var term = filter.SearchTerm.Trim().ToLower();
            products = products.Where(p =>
                (p.Name != null && p.Name.ToLower().Contains(term)) ||
                (p.Description != null && p.Description.ToLower().Contains(term)));
        }

        if (!string.IsNullOrWhiteSpace(filter.Category))
        {
            products = products.Where(p => p.Category != null &&
                p.Category.Equals(filter.Category, StringComparison.OrdinalIgnoreCase));
        }

        if (filter.MinPrice.HasValue)
        {
            products = products.Where(p => p.Price >= filter.MinPrice.Value);
        }

        if (filter.MaxPrice.HasValue)
        {
            products = products.Where(p => p.Price <= filter.MaxPrice.Value);
        }

        products = filter.SortBy?.ToLower() switch
        {
            "price_asc" => products.OrderBy(p => p.Price),
            "price_desc" => products.OrderByDescending(p => p.Price),
            "name" => products.OrderBy(p => p.Name),
            _ => products
        };

        return products.Select(MapToDto);
    }

    /// <summary>
    /// Перетворює доменну сутність товару в DTO для відповіді API.
    /// </summary>
    private static ProductDto MapToDto(Product entity) => new()
    {
        Id = entity.Id,
        Name = entity.Name,
        Description = entity.Description,
        Type = entity.Type,
        Category = entity.Category,
        Activity = entity.Activity,
        Gender = entity.Gender,
        Price = entity.Price,
        OldPrice = entity.OldPrice,
        Colors = entity.Colors ?? new(),
        Images = entity.Images,
        IsNew = entity.IsNew,
        Variants = entity.Variants?.Select(v => new CreateProductVariantDto
        {
            Color = v.Color,
            Size = v.Size,
            Quantity = v.Quantity
        }).ToList() ?? new()
    };

    /// <summary>
    /// Перетворює вхідний DTO створення товару у внутрішню доменну модель.
    /// </summary>
    private static Product MapToEntity(CreateProductDto dto) => new()
    {
        Name = dto.Name,
        Description = dto.Description,
        Type = dto.Type,
        Category = dto.Category,
        Activity = dto.Activity,
        Gender = dto.Gender,
        Price = dto.Price,
        OldPrice = dto.OldPrice,
        Colors = dto.Colors ?? new(),
        Images = dto.Images,
        IsNew = dto.IsNew,
        Variants = dto.Variants?.Select(v => new ProductVariant
        {
            Color = v.Color,
            Size = v.Size,
            Quantity = v.Quantity
        }).ToList() ?? new()
    };
}