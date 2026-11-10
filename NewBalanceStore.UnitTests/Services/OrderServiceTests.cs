using Moq;
using NUnit.Framework;
using AutoMapper;
using NewBalanceStore.Application.Services;
using NewBalanceStore.Domain.Entities;
using NewBalanceStore.Domain.Interfaces;
using NewBalanceStore.Application.DTOs;

using Assert = NUnit.Framework.Assert;

namespace NewBalanceStore.UnitTests.Services
{
    [TestFixture]
    public class OrderServiceTests
    {
        private Mock<IOrderRepository> _orderRepoMock = null!;
        private Mock<IProductRepository> _productRepoMock = null!;
        private Mock<IMapper> _mapperMock = null!;
        private OrderService _orderService = null!;

        [SetUp]
        public void SetUp()
        {
            _orderRepoMock = new Mock<IOrderRepository>();
            _productRepoMock = new Mock<IProductRepository>();
            _mapperMock = new Mock<IMapper>();

            _orderService = new OrderService(
                _orderRepoMock.Object,
                _productRepoMock.Object,
                _mapperMock.Object
            );
        }

        [Test]
        public async Task GetOrderByIdAsync_ShouldReturnOrder_WhenExists()
        {
            var orderEntity = new Order { Id = 1, Status = "Pending" };
            var orderDto = new OrderDto { Id = 1, Status = "Pending" };

            _orderRepoMock.Setup(r => r.GetByIdAsync(1))
                          .ReturnsAsync(orderEntity);

            _mapperMock.Setup(m => m.Map<OrderDto>(It.IsAny<Order>()))
                       .Returns(orderDto);

            var result = await _orderService.GetOrderByIdAsync(1);

            Assert.That(result, Is.Not.Null);
            Assert.That(result!.Id, Is.EqualTo(1));
        }

        [Test]
        public async Task GetOrderByIdAsync_ShouldReturnNull_WhenOrderDoesNotExist()
        {
            _orderRepoMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Order?)null);

            var result = await _orderService.GetOrderByIdAsync(999);

            Assert.That(result, Is.Null);
            _mapperMock.Verify(m => m.Map<OrderDto>(It.IsAny<Order>()), Times.Never);
        }

        [Test]
        public async Task CreateOrderAsync_ShouldReturnCreatedOrderDto()
        {
            var createDto = new CreateOrderDto { CustomerName = "John Doe" };
            var orderEntity = new Order { Id = 10, CustomerName = "John Doe" };
            var resultDto = new OrderDto { Id = 10, CustomerName = "John Doe" };

            _orderRepoMock.Setup(r => r.CreateAsync(It.IsAny<Order>()))
              .Returns(Task.CompletedTask);

            _mapperMock.Setup(m => m.Map<Order>(It.IsAny<CreateOrderDto>()))
                       .Returns(orderEntity);

            _mapperMock.Setup(m => m.Map<OrderDto>(It.IsAny<Order>()))
                       .Returns(resultDto);

            var result = await _orderService.CreateOrderAsync(createDto);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Id, Is.EqualTo(10));
        }

        [Test]
        public async Task CreateOrderAsync_ShouldCreateItemsAndCalculateTotalFromProducts()
        {
            var createDto = new CreateOrderDto
            {
                CustomerName = "John Doe",
                Items = new List<CreateOrderItemDto>
                {
                    new() { ProductId = 1, Color = "Grey", Size = "42", Quantity = 2 },
                    new() { ProductId = 2, Color = "Blue", Size = "M", Quantity = 1 }
                }
            };
            _productRepoMock.Setup(r => r.GetByIdAsync("1"))
                .ReturnsAsync(new Product { Id = 1, Name = "Sneaker", Price = 100 });
            _productRepoMock.Setup(r => r.GetByIdAsync("2"))
                .ReturnsAsync(new Product { Id = 2, Name = "T-Shirt", Price = 50 });

            Order? createdOrder = null;
            _orderRepoMock.Setup(r => r.CreateAsync(It.IsAny<Order>()))
                .Callback<Order>(order => createdOrder = order)
                .Returns(Task.CompletedTask);
            _mapperMock.Setup(m => m.Map<OrderDto>(It.IsAny<Order>()))
                .Returns(new OrderDto { Id = 10, TotalAmount = 250 });

            var beforeCreate = DateTime.UtcNow;
            var result = await _orderService.CreateOrderAsync(createDto);
            var afterCreate = DateTime.UtcNow;

            Assert.That(result.TotalAmount, Is.EqualTo(250));
            Assert.That(createdOrder, Is.Not.Null);
            Assert.That(createdOrder!.Status, Is.EqualTo("Pending"));
            Assert.That(createdOrder.TotalAmount, Is.EqualTo(250));
            Assert.That(createdOrder.CreatedAt, Is.InRange(beforeCreate, afterCreate));
            Assert.That(createdOrder.Items, Has.Count.EqualTo(2));
            Assert.That(createdOrder.Items[0].ProductName, Is.EqualTo("Sneaker"));
            Assert.That(createdOrder.Items[0].Color, Is.EqualTo("Grey"));
            Assert.That(createdOrder.Items[0].Size, Is.EqualTo("42"));
            Assert.That(createdOrder.Items[0].Quantity, Is.EqualTo(2));
            Assert.That(createdOrder.Items[0].Price, Is.EqualTo(100));
            Assert.That(createdOrder.Items[1].ProductName, Is.EqualTo("T-Shirt"));
        }

        [Test]
        public async Task GetAllOrdersAsync_ShouldReturnListOfOrders()
        {
            var orders = new List<Order> { new Order { Id = 1 }, new Order { Id = 2 } };
            var dtos = new List<OrderDto> { new OrderDto { Id = 1 }, new OrderDto { Id = 2 } };

            _orderRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(orders);
            _mapperMock.Setup(m => m.Map<IEnumerable<OrderDto>>(orders)).Returns(dtos);

            var result = await _orderService.GetAllOrdersAsync();

            Assert.That(result.Count(), Is.EqualTo(2));
        }

        [Test]
        public async Task UpdateOrderStatusAsync_ShouldCallRepository_WhenOrderExists()
        {
            var existingOrder = new Order { Id = 1, Status = "Pending" };

            _orderRepoMock.Setup(r => r.GetByIdAsync(1))
                          .ReturnsAsync(existingOrder);

            _orderRepoMock.Setup(r => r.UpdateStatusAsync(1, "Shipped"))
                          .Returns(Task.CompletedTask);

            await _orderService.UpdateOrderStatusAsync(1, "Shipped");

            _orderRepoMock.Verify(r => r.UpdateStatusAsync(1, "Shipped"), Times.Once);
        }

        [Test]
        public async Task CreateOrderAsync_WhenProductNotFound_SkipsItemAndCalculatesRemaining()
        {
            var createDto = new CreateOrderDto
            {
                CustomerName = "Jane Doe",
                Items = new List<CreateOrderItemDto>
                {
                    new() { ProductId = 999, Quantity = 1 },
                    new() { ProductId = 1, Quantity = 2 }
                }
            };
            _productRepoMock.Setup(r => r.GetByIdAsync("999")).ReturnsAsync((Product?)null);
            _productRepoMock.Setup(r => r.GetByIdAsync("1")).ReturnsAsync(new Product { Id = 1, Name = "Sneaker", Price = 100 });

            Order? createdOrder = null;
            _orderRepoMock.Setup(r => r.CreateAsync(It.IsAny<Order>()))
                .Callback<Order>(o => createdOrder = o)
                .Returns(Task.CompletedTask);
            _mapperMock.Setup(m => m.Map<OrderDto>(It.IsAny<Order>()))
                .Returns(new OrderDto { Id = 20, TotalAmount = 200 });

            var result = await _orderService.CreateOrderAsync(createDto);

            Assert.That(result.TotalAmount, Is.EqualTo(200));
            Assert.That(createdOrder!.Items, Has.Count.EqualTo(1));
            Assert.That(createdOrder.TotalAmount, Is.EqualTo(200));
        }
    }
}