using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using NewBalanceStore.Application.Common.Security;
using NewBalanceStore.Domain.Entities;
using NewBalanceStore.Domain.Interfaces;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace NewBalanceStore.IntegrationTests.Infrastructure;

public sealed class TestApiFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureAppConfiguration((_, configuration) =>
        {
            configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Secret"] = "IntegrationTestSecretKeyForNewBalanceStoreApi2026!",
                ["Jwt:Issuer"] = "NewBalanceStore.IntegrationTests",
                ["Jwt:Audience"] = "NewBalanceStore.IntegrationTests",
                ["Jwt:ExpiryInMinutes"] = "60"
            });
        });

        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll<Firebase.Database.FirebaseClient>();
            services.RemoveAll<IProductRepository>();
            services.RemoveAll<IOrderRepository>();
            services.RemoveAll<IPhotoService>();
            services.RemoveAll<IEmailService>();

            services.AddSingleton<IProductRepository, LocalProductRepository>();
            services.AddSingleton<IOrderRepository, LocalOrderRepository>();
            services.AddSingleton<IPhotoService, LocalPhotoService>();
            services.AddSingleton(Mock.Of<IEmailService>());

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = TestAuthenticationHandler.SchemeName;
                options.DefaultChallengeScheme = TestAuthenticationHandler.SchemeName;
                options.DefaultForbidScheme = TestAuthenticationHandler.SchemeName;
            }).AddScheme<AuthenticationSchemeOptions, TestAuthenticationHandler>(
                TestAuthenticationHandler.SchemeName, _ => { });

            services.RemoveAll<IJwtTokenGenerator>();
            services.AddSingleton(Mock.Of<IJwtTokenGenerator>(g =>
                g.GenerateAccessToken(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<IList<string>>()) == "test-token"
            ));
        });
    }
}

public sealed class TestAuthenticationHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder)
    : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
    public const string SchemeName = "IntegrationTest";

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var role = Request.Headers["X-Test-Role"].ToString();
        if (string.IsNullOrWhiteSpace(role))
        {
            return Task.FromResult(AuthenticateResult.NoResult());
        }

        Claim[] claims =
        [
            new(ClaimTypes.NameIdentifier, "integration-test-user"),
            new(ClaimTypes.Name, "Integration Test"),
            new(ClaimTypes.Role, role)
        ];
        var identity = new ClaimsIdentity(claims, SchemeName);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, SchemeName);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}

internal sealed class LocalProductRepository : IProductRepository
{
    private readonly Dictionary<string, Product> _products = new(StringComparer.Ordinal);
    private int _nextId = 1000;

    public LocalProductRepository()
    {
        AddSeed(new Product { Id = 1, Name = "New Balance 574", Description = "Classic sneaker", Category = "Shoes", Price = 120 });
        AddSeed(new Product { Id = 2, Name = "Fresh Foam", Description = "Running sneaker", Category = "Shoes", Price = 150 });
        AddSeed(new Product { Id = 3, Name = "Logo Tee", Description = "Cotton shirt", Category = "Clothing", Price = 35 });
    }

    public Task<List<Product>> GetAllAsync() =>
        Task.FromResult(_products.Values.Select(Clone).ToList());

    public Task<Product?> GetByIdAsync(string id) =>
        Task.FromResult(_products.TryGetValue(id, out var product) ? Clone(product) : null);

    public Task CreateAsync(Product product)
    {
        if (product.Id <= 0)
        {
            product.Id = _nextId++;
        }

        _products[product.Id.ToString()] = Clone(product);
        return Task.CompletedTask;
    }

    public Task UpdateAsync(Product product)
    {
        _products[product.Id.ToString()] = Clone(product);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(string id)
    {
        _products.Remove(id);
        return Task.CompletedTask;
    }

    private void AddSeed(Product product) => _products[product.Id.ToString()] = product;

    private static Product Clone(Product product) => new()
    {
        Id = product.Id,
        Name = product.Name,
        Description = product.Description,
        Type = product.Type,
        Category = product.Category,
        Activity = product.Activity,
        Gender = product.Gender,
        Price = product.Price,
        OldPrice = product.OldPrice,
        IsNew = product.IsNew,
        Colors = [.. product.Colors],
        Images = product.Images.ToDictionary(entry => entry.Key, entry => new List<string>(entry.Value)),
        Variants = product.Variants.Select(variant => new ProductVariant
        {
            Color = variant.Color,
            Size = variant.Size,
            Quantity = variant.Quantity
        }).ToList()
    };
}

internal sealed class LocalOrderRepository : IOrderRepository
{
    private readonly Dictionary<int, Order> _orders = [];
    private int _nextId = 2000;

    public Task<Order?> GetByIdAsync(int id) =>
        Task.FromResult(_orders.TryGetValue(id, out var order) ? Clone(order) : null);

    public Task<IEnumerable<Order>> GetAllAsync() =>
        Task.FromResult<IEnumerable<Order>>(_orders.Values.Select(Clone).ToList());

    public Task CreateAsync(Order order)
    {
        if (order.Id <= 0)
        {
            order.Id = _nextId++;
        }

        _orders[order.Id] = Clone(order);
        return Task.CompletedTask;
    }

    public Task UpdateStatusAsync(int id, string status)
    {
        if (_orders.TryGetValue(id, out var order))
        {
            order.Status = status;
        }

        return Task.CompletedTask;
    }

    private static Order Clone(Order order) => new()
    {
        Id = order.Id,
        CustomerName = order.CustomerName,
        CustomerEmail = order.CustomerEmail,
        CustomerPhone = order.CustomerPhone,
        ShippingAddress = order.ShippingAddress,
        TotalAmount = order.TotalAmount,
        Status = order.Status,
        CreatedAt = order.CreatedAt,
        Items = order.Items.Select(item => new OrderItem
        {
            ProductId = item.ProductId,
            ProductName = item.ProductName,
            Color = item.Color,
            Size = item.Size,
            Quantity = item.Quantity,
            Price = item.Price
        }).ToList()
    };
}

internal sealed class LocalPhotoService : IPhotoService
{
    public async Task<string> AddPhotoAsync(Stream fileStream, string fileName)
    {
        if (fileStream.Length == 0)
        {
            return string.Empty;
        }

        await fileStream.CopyToAsync(Stream.Null);
        return $"https://local.test/photos/{Uri.EscapeDataString(fileName)}";
    }
}
