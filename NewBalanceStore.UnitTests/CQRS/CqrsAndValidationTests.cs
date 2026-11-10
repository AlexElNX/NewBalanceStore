using ErrorOr;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using NewBalanceStore.Application.Common.Behaviors;
using NewBalanceStore.Application.Common.Caching;
using NewBalanceStore.Application.CQRS.Orders.Commands;
using NewBalanceStore.Application.CQRS.Orders.Commands.Handlers;
using NewBalanceStore.Application.CQRS.Orders.Queries;
using NewBalanceStore.Application.CQRS.Orders.Queries.Handlers;
using NewBalanceStore.Application.CQRS.Products.Commands;
using NewBalanceStore.Application.CQRS.Products.Commands.Handlers;
using NewBalanceStore.Application.CQRS.Products.Queries;
using NewBalanceStore.Application.CQRS.Products.Queries.Handlers;
using NewBalanceStore.Application.DTOs;
using NewBalanceStore.Application.Interfaces;
using NewBalanceStore.Application.Services;
using NewBalanceStore.Application.Validators;
using NUnit.Framework;
using Assert = NUnit.Framework.Assert;

namespace NewBalanceStore.UnitTests.CQRS;

[TestFixture]
public class CqrsAndValidationTests
{
    private Mock<IProductService> _productServiceMock = null!;
    private Mock<IOrderService> _orderServiceMock = null!;
    private IMemoryCache _memoryCache = null!;

    [SetUp]
    public void SetUp()
    {
        _productServiceMock = new Mock<IProductService>();
        _orderServiceMock = new Mock<IOrderService>();
        _memoryCache = new MemoryCache(new MemoryCacheOptions());
    }

    [TearDown]
    public void TearDown()
    {
        _memoryCache.Dispose();
    }

    [Test]
    public async Task GetProductsQueryHandler_ReturnsAllProducts()
    {
        var sampleProducts = new List<ProductDto>
        {
            new() { Id = 1, Name = "NB 574" },
            new() { Id = 2, Name = "NB 990" }
        };
        _productServiceMock.Setup(s => s.GetAllAsync()).ReturnsAsync(sampleProducts);

        var handler = new GetProductsQueryHandler(_productServiceMock.Object);
        var result = await handler.Handle(new GetProductsQuery(), CancellationToken.None);

        Assert.That(result.IsError, Is.False);
        Assert.That(result.Value, Has.Count.EqualTo(2));
    }

    [Test]
    public async Task GetFilteredProductsQueryHandler_DelegatesToService()
    {
        var filter = new ProductFilterDto { SearchTerm = "574" };
        var sample = new List<ProductDto> { new() { Id = 1, Name = "NB 574" } };
        _productServiceMock.Setup(s => s.GetFilteredProductsAsync(filter)).ReturnsAsync(sample);

        var handler = new GetFilteredProductsQueryHandler(_productServiceMock.Object);
        var result = await handler.Handle(new GetFilteredProductsQuery(filter), CancellationToken.None);

        Assert.That(result.Count(), Is.EqualTo(1));
    }

    [Test]
    public async Task CreateProductCommandHandler_CreatesAndClearsCache()
    {
        _memoryCache.Set("products-all", new List<ProductDto>());
        var dto = new CreateProductDto { Name = "New Shoe" };
        var created = new ProductDto { Id = 10, Name = "New Shoe" };
        _productServiceMock.Setup(s => s.CreateAsync(dto)).ReturnsAsync(created);

        var handler = new CreateProductCommandHandler(_productServiceMock.Object, _memoryCache);
        var result = await handler.Handle(new CreateProductCommand(dto), CancellationToken.None);

        Assert.That(result.IsError, Is.False);
        Assert.That(result.Value.Id, Is.EqualTo(10));
        Assert.That(_memoryCache.TryGetValue("products-all", out _), Is.False);
    }

    [Test]
    public async Task UpdateProductCommandHandler_WhenFound_UpdatesAndClearsCache()
    {
        _memoryCache.Set("products-all", new List<ProductDto>());
        var dto = new CreateProductDto { Name = "Updated" };
        _productServiceMock.Setup(s => s.UpdateAsync("10", dto)).ReturnsAsync(true);

        var handler = new UpdateProductCommandHandler(_productServiceMock.Object, _memoryCache);
        var result = await handler.Handle(new UpdateProductCommand("10", dto), CancellationToken.None);

        Assert.That(result.IsError, Is.False);
        Assert.That(_memoryCache.TryGetValue("products-all", out _), Is.False);
    }

    [Test]
    public async Task UpdateProductCommandHandler_WhenNotFound_ReturnsError()
    {
        _productServiceMock.Setup(s => s.UpdateAsync("999", It.IsAny<CreateProductDto>())).ReturnsAsync(false);

        var handler = new UpdateProductCommandHandler(_productServiceMock.Object, _memoryCache);
        var result = await handler.Handle(new UpdateProductCommand("999", new CreateProductDto()), CancellationToken.None);

        Assert.That(result.IsError, Is.True);
        Assert.That(result.FirstError.Type, Is.EqualTo(ErrorType.NotFound));
    }

    [Test]
    public async Task DeleteProductCommandHandler_WhenFound_DeletesAndClearsCache()
    {
        _memoryCache.Set("products-all", new List<ProductDto>());
        _productServiceMock.Setup(s => s.DeleteAsync("10")).ReturnsAsync(true);

        var handler = new DeleteProductCommandHandler(_productServiceMock.Object, _memoryCache);
        var result = await handler.Handle(new DeleteProductCommand("10"), CancellationToken.None);

        Assert.That(result.IsError, Is.False);
        Assert.That(_memoryCache.TryGetValue("products-all", out _), Is.False);
    }

    [Test]
    public async Task DeleteProductCommandHandler_WhenNotFound_ReturnsError()
    {
        _productServiceMock.Setup(s => s.DeleteAsync("999")).ReturnsAsync(false);

        var handler = new DeleteProductCommandHandler(_productServiceMock.Object, _memoryCache);
        var result = await handler.Handle(new DeleteProductCommand("999"), CancellationToken.None);

        Assert.That(result.IsError, Is.True);
        Assert.That(result.FirstError.Type, Is.EqualTo(ErrorType.NotFound));
    }

    [Test]
    public async Task CreateOrderCommandHandler_DelegatesToService()
    {
        var dto = new CreateOrderDto { CustomerName = "Alice" };
        var order = new OrderDto { Id = 100, CustomerName = "Alice" };
        _orderServiceMock.Setup(s => s.CreateOrderAsync(dto)).ReturnsAsync(order);

        var handler = new CreateOrderCommandHandler(_orderServiceMock.Object);
        var result = await handler.Handle(new CreateOrderCommand(dto), CancellationToken.None);

        Assert.That(result.Id, Is.EqualTo(100));
    }

    [Test]
    public async Task UpdateOrderStatusCommandHandler_DelegatesToService()
    {
        _orderServiceMock.Setup(s => s.UpdateOrderStatusAsync(100, "Delivered")).Returns(Task.CompletedTask);

        var handler = new UpdateOrderStatusCommandHandler(_orderServiceMock.Object);
        await handler.Handle(new UpdateOrderStatusCommand(100, "Delivered"), CancellationToken.None);

        _orderServiceMock.Verify(s => s.UpdateOrderStatusAsync(100, "Delivered"), Times.Once);
    }

    [Test]
    public async Task CachingBehavior_CachesResponseOnMiss_AndReturnsFromCacheOnHit()
    {
        var behavior = new CachingBehavior<GetProductsQuery, ErrorOr<List<ProductDto>>>(
            _memoryCache,
            NullLogger<CachingBehavior<GetProductsQuery, ErrorOr<List<ProductDto>>>>.Instance);

        var query = new GetProductsQuery();
        var data = new List<ProductDto> { new() { Id = 1, Name = "Sneaker" } };
        int executionCount = 0;

        RequestHandlerDelegate<ErrorOr<List<ProductDto>>> next = _ =>
        {
            executionCount++;
            return Task.FromResult<ErrorOr<List<ProductDto>>>(data);
        };

        var firstResult = await behavior.Handle(query, next, CancellationToken.None);
        var secondResult = await behavior.Handle(query, next, CancellationToken.None);

        Assert.That(firstResult.Value, Has.Count.EqualTo(1));
        Assert.That(secondResult.Value, Has.Count.EqualTo(1));
        Assert.That(executionCount, Is.EqualTo(1)); // second call was satisfied from cache
    }

    [Test]
    public void ValidationBehavior_WhenValidationFails_ThrowsValidationException()
    {
        var validator = new CreateProductCommandValidator();
        var behavior = new ValidationBehavior<CreateProductCommand, ErrorOr<ProductDto>>([validator]);

        var invalidCommand = new CreateProductCommand(new CreateProductDto { Name = "", Price = -10 });

        Assert.ThrowsAsync<ValidationException>(() =>
            behavior.Handle(invalidCommand, _ => Task.FromResult<ErrorOr<ProductDto>>(new ProductDto()), CancellationToken.None));
    }

    [Test]
    public async Task ValidationBehavior_WhenValid_ExecutesNextDelegate()
    {
        var validator = new CreateProductCommandValidator();
        var behavior = new ValidationBehavior<CreateProductCommand, ErrorOr<ProductDto>>([validator]);

        var validCommand = new CreateProductCommand(new CreateProductDto
        {
            Name = "NB Fresh Foam",
            Price = 120,
            Category = "Shoes"
        });

        var expectedProduct = new ProductDto { Id = 1, Name = "NB Fresh Foam" };
        var result = await behavior.Handle(validCommand, _ => Task.FromResult<ErrorOr<ProductDto>>(expectedProduct), CancellationToken.None);

        Assert.That(result.Value.Id, Is.EqualTo(1));
    }

    [Test]
    public void Validators_ValidateCorrectly()
    {
        var productValidator = new CreateProductDtoValidator();
        Assert.That(productValidator.Validate(new CreateProductDto { Name = "", Price = 0 }).IsValid, Is.False);
        Assert.That(productValidator.Validate(new CreateProductDto { Name = "Shoe", Price = 100, Category = "Shoes" }).IsValid, Is.True);

        var updateCommandValidator = new UpdateProductCommandValidator();
        Assert.That(updateCommandValidator.Validate(new UpdateProductCommand("", new CreateProductDto())).IsValid, Is.False);
        Assert.That(updateCommandValidator.Validate(new UpdateProductCommand("1", new CreateProductDto { Name = "Shoe", Price = 50, Category = "Shoes" })).IsValid, Is.True);

        var orderValidator = new CreateOrderDtoValidator();
        Assert.That(orderValidator.Validate(new CreateOrderDto { CustomerName = "" }).IsValid, Is.False);
        Assert.That(orderValidator.Validate(new CreateOrderDto
        {
            CustomerName = "John",
            CustomerEmail = "john@example.com",
            Items = [new CreateOrderItemDto { ProductId = 1, Quantity = 1 }]
        }).IsValid, Is.True);

        var orderCommandValidator = new CreateOrderCommandValidator();
        Assert.That(orderCommandValidator.Validate(new CreateOrderCommand(null!)).IsValid, Is.False);
        Assert.That(orderCommandValidator.Validate(new CreateOrderCommand(new CreateOrderDto
        {
            CustomerName = "John",
            CustomerEmail = "john@example.com",
            Items = [new CreateOrderItemDto { ProductId = 1, Quantity = 1 }]
        })).IsValid, Is.True);

        var regValidator = new UserRegisterDtoValidator();
        Assert.That(regValidator.Validate(new UserRegisterDto { Email = "notanemail", Password = "123", FullName = "" }).IsValid, Is.False);
        Assert.That(regValidator.Validate(new UserRegisterDto { Email = "john@example.com", Password = "Password123!", FullName = "John Doe" }).IsValid, Is.True);

        var loginValidator = new UserLoginDtoValidator();
        Assert.That(loginValidator.Validate(new UserLoginDto { Email = "", Password = "" }).IsValid, Is.False);
        Assert.That(loginValidator.Validate(new UserLoginDto { Email = "john@example.com", Password = "Password123!" }).IsValid, Is.True);
    }

    [Test]
    public async Task GetProductByIdQueryHandler_WhenProductExists_ReturnsProduct()
    {
        var product = new ProductDto { Id = 5, Name = "Product 5" };
        _productServiceMock.Setup(s => s.GetByIdAsync("5")).ReturnsAsync(product);

        var handler = new GetProductByIdQueryHandler(_productServiceMock.Object);
        var result = await handler.Handle(new GetProductByIdQuery("5"), CancellationToken.None);

        Assert.That(result.IsError, Is.False);
        Assert.That(result.Value.Name, Is.EqualTo("Product 5"));
    }

    [Test]
    public async Task GetProductByIdQueryHandler_WhenProductMissing_ReturnsNotFoundError()
    {
        _productServiceMock.Setup(s => s.GetByIdAsync("missing")).ReturnsAsync((ProductDto?)null);

        var handler = new GetProductByIdQueryHandler(_productServiceMock.Object);
        var result = await handler.Handle(new GetProductByIdQuery("missing"), CancellationToken.None);

        Assert.That(result.IsError, Is.True);
        Assert.That(result.FirstError.Type, Is.EqualTo(ErrorType.NotFound));
    }

    [Test]
    public async Task GetOrderByIdQueryHandler_DelegatesToService()
    {
        var order = new OrderDto { Id = 77, Status = "Pending" };
        _orderServiceMock.Setup(s => s.GetOrderByIdAsync(77)).ReturnsAsync(order);

        var handler = new GetOrderByIdQueryHandler(_orderServiceMock.Object);
        var result = await handler.Handle(new GetOrderByIdQuery(77), CancellationToken.None);

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Id, Is.EqualTo(77));
    }

    [Test]
    public async Task CreateProductCommandHandler_WhenServiceReturnsNull_ReturnsFailureError()
    {
        var dto = new CreateProductDto { Name = "Failed" };
        _productServiceMock.Setup(s => s.CreateAsync(dto)).ReturnsAsync((ProductDto?)null);

        var handler = new CreateProductCommandHandler(_productServiceMock.Object, _memoryCache);
        var result = await handler.Handle(new CreateProductCommand(dto), CancellationToken.None);

        Assert.That(result.IsError, Is.True);
        Assert.That(result.FirstError.Type, Is.EqualTo(ErrorType.Failure));
    }

    private record NonCachableRequest : IRequest<string>;
    private record CachableWithNullExpirationRequest : IRequest<string>, ICachableRequest
    {
        public string CacheKey => "null-expiration-key";
        public TimeSpan? SlidingExpiration => null;
    }

    [Test]
    public async Task CachingBehavior_WhenRequestIsNotCachable_PassesThroughWithoutCaching()
    {
        var behavior = new CachingBehavior<NonCachableRequest, string>(
            _memoryCache,
            NullLogger<CachingBehavior<NonCachableRequest, string>>.Instance);

        int callCount = 0;
        RequestHandlerDelegate<string> next = _ =>
        {
            callCount++;
            return Task.FromResult("non-cachable-result");
        };

        var result1 = await behavior.Handle(new NonCachableRequest(), next, CancellationToken.None);
        var result2 = await behavior.Handle(new NonCachableRequest(), next, CancellationToken.None);

        Assert.That(result1, Is.EqualTo("non-cachable-result"));
        Assert.That(result2, Is.EqualTo("non-cachable-result"));
        Assert.That(callCount, Is.EqualTo(2));
    }

    [Test]
    public async Task CachingBehavior_WhenSlidingExpirationIsNull_UsesDefaultExpiration()
    {
        var behavior = new CachingBehavior<CachableWithNullExpirationRequest, string>(
            _memoryCache,
            NullLogger<CachingBehavior<CachableWithNullExpirationRequest, string>>.Instance);

        int callCount = 0;
        RequestHandlerDelegate<string> next = _ =>
        {
            callCount++;
            return Task.FromResult("default-cached-result");
        };

        var request = new CachableWithNullExpirationRequest();
        var result1 = await behavior.Handle(request, next, CancellationToken.None);
        var result2 = await behavior.Handle(request, next, CancellationToken.None);

        Assert.That(result1, Is.EqualTo("default-cached-result"));
        Assert.That(result2, Is.EqualTo("default-cached-result"));
        Assert.That(callCount, Is.EqualTo(1));
    }
}
