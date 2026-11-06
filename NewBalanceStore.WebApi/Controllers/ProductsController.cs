using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NewBalanceStore.Application.CQRS.Products.Commands;
using NewBalanceStore.Application.CQRS.Products.Queries;
using NewBalanceStore.Application.DTOs;
using NewBalanceStore.Application.Interfaces;
using NewBalanceStore.Domain.Interfaces;

namespace NewBalanceStore.WebApi.Controllers;

/// <summary>
/// Контролер для керування товарами в каталозі інтернет-магазину.
/// Забезпечує пошук, фільтрацію та адміністрування товарних позицій.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly IPhotoService _photoService;
    private readonly IMediator _mediator;

    /// <summary>
    /// Ініціалізує новий екземпляр контролера <see cref="ProductsController"/>.
    /// </summary>
    /// <param name="productService">Сервіс управління товарами.</param>
    /// <param name="photoService">Сервіс завантаження фотографій до Cloudinary.</param>
    /// <param name="mediator">Mediator для обробки команд.</param>
    public ProductsController(IProductService productService, IPhotoService photoService, IMediator mediator)
    {
        _productService = productService;
        _photoService = photoService;
        _mediator = mediator;
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpGet("analytics")]
    public IActionResult GetAnalytics()
    {
        return Ok(new { message = "Це секретна аналітика лише для адміністраторів!" });
    }

    /// <summary>
    /// Получить список товаров с возможностью фильтрации
    /// </summary>
    /// <param name="filter">Параметры фильтрации товаров (категория, бренд, цена и т.д.)</param>
    /// <returns>Список отфильтрованных товаров</returns>
    /// <response code="200">Успешно возвращен список товаров</response>
    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] ProductFilterDto filter)
    {
        var products = await _productService.GetFilteredProductsAsync(filter);
        return Ok(products);
    }

    /// <summary>
    /// Получить конкретный товар по его уникальному идентификатору
    /// </summary>
    /// <param name="id">Идентификатор товара</param>
    /// <returns>Информация о товаре</returns>
    /// <response code="200">Товар успешно найден и возвращен</response>
    /// <response code="404">Товар с указанным ID не найден</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(string id)
    {
        var result = await _mediator.Send(new GetProductByIdQuery(id));

        return result.Match(
            product => Ok(product),
            errors =>
            {
                var firstError = errors[0];

                var statusCode = firstError.Type switch
                {
                    ErrorType.NotFound => StatusCodes.Status404NotFound,
                    ErrorType.Validation => StatusCodes.Status400BadRequest,
                    ErrorType.Unauthorized => StatusCodes.Status401Unauthorized,
                    _ => StatusCodes.Status500InternalServerError
                };

                return Problem(
                    statusCode: statusCode,
                    title: firstError.Description
                );
            }
        );
    }

    /// <summary>
    /// Создать новый товар (доступно только администратору)
    /// </summary>
    /// <param name="dto">Данные для создания товара</param>
    /// <returns>Созданный объект товара</returns>
    /// <response code="201">Товар успешно создан</response>
    /// <response code="401">Пользователь не авторизован</response>
    /// <response code="403">Недостаточно прав (требуется роль Admin)</response>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Create([FromBody] CreateProductDto dto)
    {
        var result = await _mediator.Send(new CreateProductCommand(dto));

        return result.Match(
            product => CreatedAtAction(nameof(GetById), new { id = product.Id }, product),
            errors =>
            {
                var firstError = errors[0];
                return Problem(
                    statusCode: StatusCodes.Status400BadRequest,
                    title: firstError.Description
                );
            }
        );
    }

    /// <summary>
    /// Загрузить изображение товара в облачное хранилище Cloudinary (доступно только администратору).
    /// </summary>
    /// <param name="file">Файл изображения</param>
    /// <returns>Ссылка на загруженное изображение</returns>
    /// <response code="200">Изображение успешно загружено</response>
    /// <response code="400">Файл не выбран или произошла ошибка при загрузке</response>
    [HttpPost("upload-image")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Файл не выбран");

        using var stream = file.OpenReadStream();
        var photoUrl = await _photoService.AddPhotoAsync(stream, file.FileName);

        if (string.IsNullOrEmpty(photoUrl))
            return BadRequest("Ошибка при загрузке изображении.");

        return Ok(new { Url = photoUrl });
    }

    /// <summary>
    /// Обновить существующий товар по ID (доступно только администратору).
    /// </summary>
    /// <param name="id">Идентификатор обновляемого товара</param>
    /// <param name="dto">Новые данные товара</param>
    /// <response code="204">Товар успешно обновлен</response>
    /// <response code="404">Товар с указанным ID не найден</response>
    /// <response code="401">Неавторизованный доступ</response>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(string id, [FromBody] CreateProductDto dto)
    {
        var result = await _mediator.Send(new UpdateProductCommand(id, dto));

        return result.Match<IActionResult>(
            success => NoContent(),
            errors => errors[0].Type == ErrorType.NotFound
                ? NotFound(errors[0].Description)
                : BadRequest(errors[0].Description)
        );
    }

    /// <summary>
    /// Удалить товар по ID (доступно только администратору)
    /// </summary>
    /// <param name="id">Идентификатор удаляемого товара</param>
    /// <response code="204">Товар успешно удален</response>
    /// <response code="404">Товар с указанным ID не найден</response>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _mediator.Send(new DeleteProductCommand(id));

        return result.Match<IActionResult>(
            success => NoContent(),
            errors => errors[0].Type == ErrorType.NotFound
                ? NotFound(errors[0].Description)
                : BadRequest(errors[0].Description)
        );
    }

    public static implicit operator ProductsController(AuthController v)
    {
        throw new NotImplementedException();
    }
}