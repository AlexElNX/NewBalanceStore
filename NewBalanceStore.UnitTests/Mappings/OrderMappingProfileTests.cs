using AutoMapper;
using NewBalanceStore.Application.DTOs;
using NewBalanceStore.Application.Mappings;
using NewBalanceStore.Domain.Entities;
using NUnit.Framework;
using Assert = NUnit.Framework.Assert;

namespace NewBalanceStore.UnitTests.Mappings;

[TestFixture]
public class OrderMappingProfileTests
{
    private IMapper _mapper = null!;

    [SetUp]
    public void SetUp()
    {
        var expression = new AutoMapper.MapperConfigurationExpression();
        expression.AddProfile<OrderMappingProfile>();

        var loggerFactoryMock = new Moq.Mock<Microsoft.Extensions.Logging.ILoggerFactory>();
        var configProvider = new MapperConfiguration(expression, loggerFactoryMock.Object);
        _mapper = configProvider.CreateMapper();
    }

    [Test]
    public void OrderMappingProfile_MapsOrderToOrderDto()
    {
        var order = new Order
        {
            Id = 1,
            CustomerName = "John Doe",
            CustomerEmail = "john@example.com",
            CustomerPhone = "+123456789",
            ShippingAddress = "123 Main St",
            TotalAmount = 150.5m,
            Status = "Shipped",
            CreatedAt = new DateTime(2026, 1, 1),
            Items = new List<OrderItem>
            {
                new()
                {
                    ProductId = "42",
                    ProductName = "NB 574",
                    Color = "Grey",
                    Size = "43",
                    Quantity = 2,
                    Price = 75.25m
                }
            }
        };

        var dto = _mapper.Map<OrderDto>(order);

        Assert.That(dto, Is.Not.Null);
        Assert.That(dto.Id, Is.EqualTo(1));
        Assert.That(dto.CustomerName, Is.EqualTo("John Doe"));
        Assert.That(dto.CustomerEmail, Is.EqualTo("john@example.com"));
        Assert.That(dto.CustomerPhone, Is.EqualTo("+123456789"));
        Assert.That(dto.ShippingAddress, Is.EqualTo("123 Main St"));
        Assert.That(dto.TotalAmount, Is.EqualTo(150.5m));
        Assert.That(dto.Status, Is.EqualTo("Shipped"));
        Assert.That(dto.CreatedAt, Is.EqualTo(new DateTime(2026, 1, 1)));
        Assert.That(dto.Items, Has.Count.EqualTo(1));
        Assert.That(dto.Items[0].ProductId, Is.EqualTo(42));
        Assert.That(dto.Items[0].ProductName, Is.EqualTo("NB 574"));
        Assert.That(dto.Items[0].Color, Is.EqualTo("Grey"));
        Assert.That(dto.Items[0].Size, Is.EqualTo("43"));
        Assert.That(dto.Items[0].Quantity, Is.EqualTo(2));
        Assert.That(dto.Items[0].Price, Is.EqualTo(75.25m));
    }
}
