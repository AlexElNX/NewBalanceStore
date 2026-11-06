using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NewBalanceStore.Application.CQRS.Orders.Commands;
using NewBalanceStore.Application.CQRS.Orders.Queries;
using NewBalanceStore.Application.CQRS.Products.Commands;
using NewBalanceStore.Application.CQRS.Products.Queries;
using NewBalanceStore.Application.DTOs;
using NewBalanceStore.Application.Interfaces;
using NewBalanceStore.Application.Services;
using NewBalanceStore.Domain.Interfaces;
using NewBalanceStore.WebApi.Controllers;
using NUnit.Framework;
using Assert = NUnit.Framework.Assert;

namespace NewBalanceStore.UnitTests.Controllers;

[TestFixture]
public class ProductsControllerTests
{
    private Mock<IProductService> _productServiceMock = null!;
    private Mock<IPhotoService> _photoServiceMock = null!;
    private Mock<IMediator> _mediatorMock = null!;
    private ProductsController _controller = null!;

    [SetUp]
    public void SetUp()
    {
        _productServiceMock = new Mock<IProductService>();
        _photoServiceMock = new Mock<IPhotoService>();
        _mediatorMock = new Mock<IMediator>();

        _controller = new ProductsController(_productServiceMock.Object, _photoServiceMock.Object, _mediatorMock.Object);
    }

    [Test]
    public async Task GetProducts_ReturnsOkAndPassesFilterToService()
    {
        var filter = new ProductFilterDto { SearchTerm = "574" };
        _productServiceMock.Setup(s => s.GetFilteredProductsAsync(filter))
            .ReturnsAsync(Array.Empty<ProductDto>());

        var result = await _controller.GetProducts(filter);

        Assert.That(result, Is.InstanceOf<OkObjectResult>());
        _productServiceMock.Verify(s => s.GetFilteredProductsAsync(filter), Times.Once);
    }

    [Test]
    public async Task GetById_WhenProductExists_ReturnsOk()
    {
        _mediatorMock.Setup(m => m.Send(It.IsAny<GetProductByIdQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ProductDto { Id = 1, Name = "Sneaker" });

        var result = await _controller.GetById("1");

        Assert.That(result, Is.InstanceOf<OkObjectResult>());
        Assert.That(((OkObjectResult)result).Value, Is.InstanceOf<ProductDto>());
    }

    [Test]
    public async Task GetById_WhenProductDoesNotExist_ReturnsNotFound()
    {
        _mediatorMock.Setup(m => m.Send(It.IsAny<GetProductByIdQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Error.NotFound("Product.NotFound", "Не найден"));

        var result = await _controller.GetById("missing");

        Assert.That(result, Is.InstanceOf<ObjectResult>());
        var objectResult = (ObjectResult)result;
        Assert.That(objectResult.StatusCode, Is.EqualTo(StatusCodes.Status404NotFound));
    }

    [Test]
    public async Task Create_ReturnsCreatedAtAction()
    {
        var dto = new CreateProductDto { Name = "Sneaker" };

        _mediatorMock
            .Setup(m => m.Send(It.IsAny<CreateProductCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ProductDto { Id = 7, Name = "Sneaker" });

        var result = await _controller.Create(dto);

        Assert.That(result, Is.InstanceOf<CreatedAtActionResult>());
        var created = (CreatedAtActionResult)result;
        Assert.That(created.ActionName, Is.EqualTo(nameof(ProductsController.GetById)));
        Assert.That(created.RouteValues!["id"], Is.EqualTo(7));

        _mediatorMock.Verify(m => m.Send(It.IsAny<CreateProductCommand>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task Update_WhenProductExists_ReturnsNoContent()
    {
        var dto = new CreateProductDto { Name = "Updated sneaker" };
        _productServiceMock.Setup(s => s.UpdateAsync("1", dto)).ReturnsAsync(true);

        var result = await _controller.Update("1", dto);

        Assert.That(result, Is.InstanceOf<NoContentResult>());
    }

    [Test]
    public async Task Update_WhenProductDoesNotExist_ReturnsNotFound()
    {
        _productServiceMock.Setup(s => s.UpdateAsync("missing", It.IsAny<CreateProductDto>()))
            .ReturnsAsync(false);

        var result = await _controller.Update("missing", new CreateProductDto());

        Assert.That(result, Is.InstanceOf<NotFoundResult>());
    }

    [Test]
    public async Task Delete_WhenProductExists_ReturnsNoContent()
    {
        _productServiceMock.Setup(s => s.DeleteAsync("1")).ReturnsAsync(true);

        var result = await _controller.Delete("1");

        Assert.That(result, Is.InstanceOf<NoContentResult>());
    }

    [Test]
    public async Task Delete_WhenProductDoesNotExist_ReturnsNotFound()
    {
        _productServiceMock.Setup(s => s.DeleteAsync("missing")).ReturnsAsync(false);

        var result = await _controller.Delete("missing");

        Assert.That(result, Is.InstanceOf<NotFoundResult>());
    }

    [Test]
    public async Task UploadImage_WhenFileIsEmpty_ReturnsBadRequestWithoutCallingPhotoService()
    {
        var file = new FormFile(new MemoryStream(), 0, 0, "file", "empty.png");

        var result = await _controller.UploadImage(file);

        Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
        _photoServiceMock.Verify(s => s.AddPhotoAsync(It.IsAny<Stream>(), It.IsAny<string>()), Times.Never);
    }

    [Test]
    public async Task UploadImage_WhenPhotoServiceReturnsUrl_ReturnsOk()
    {
        var file = new FormFile(new MemoryStream(new byte[] { 1 }), 0, 1, "file", "shoe.png");
        _photoServiceMock.Setup(s => s.AddPhotoAsync(It.IsAny<Stream>(), "shoe.png"))
            .ReturnsAsync("https://example.test/shoe.png");

        var result = await _controller.UploadImage(file);

        Assert.That(result, Is.InstanceOf<OkObjectResult>());
        _photoServiceMock.Verify(s => s.AddPhotoAsync(It.IsAny<Stream>(), "shoe.png"), Times.Once);
    }

    [Test]
    public async Task UploadImage_WhenPhotoServiceReturnsNoUrl_ReturnsBadRequest()
    {
        var file = new FormFile(new MemoryStream(new byte[] { 1 }), 0, 1, "file", "shoe.png");
        _photoServiceMock.Setup(s => s.AddPhotoAsync(It.IsAny<Stream>(), "shoe.png"))
            .ReturnsAsync(string.Empty);

        var result = await _controller.UploadImage(file);

        Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
    }
}

[TestFixture]
public class OrdersControllerTests
{
    private Mock<IMediator> _mediatorMock = null!;
    private OrdersController _controller = null!;

    [SetUp]
    public void SetUp()
    {
        _mediatorMock = new Mock<IMediator>();
        _controller = new OrdersController(_mediatorMock.Object);
    }

    [Test]
    public async Task Create_ReturnsCreatedAtAction()
    {
        var dto = new CreateOrderDto { CustomerName = "John Doe" };

        _mediatorMock.Setup(m => m.Send(It.IsAny<CreateOrderCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new OrderDto { Id = 3, CustomerName = "John Doe" });

        var result = await _controller.Create(dto);

        Assert.That(result, Is.InstanceOf<CreatedAtActionResult>());
        var created = (CreatedAtActionResult)result;
        Assert.That(created.ActionName, Is.EqualTo(nameof(OrdersController.GetById)));
        Assert.That(created.RouteValues!["id"], Is.EqualTo(3));

        _mediatorMock.Verify(m => m.Send(It.IsAny<CreateOrderCommand>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task GetById_WhenOrderExists_ReturnsOk()
    {
        _mediatorMock.Setup(m => m.Send(It.IsAny<GetOrderByIdQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new OrderDto { Id = 3 });

        var result = await _controller.GetById(3);

        Assert.That(result, Is.InstanceOf<OkObjectResult>());
    }

    [Test]
    public async Task GetById_WhenOrderDoesNotExist_ReturnsNotFound()
    {
        _mediatorMock.Setup(m => m.Send(It.IsAny<GetOrderByIdQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((OrderDto?)null);

        var result = await _controller.GetById(999);

        Assert.That(result, Is.InstanceOf<NotFoundResult>());
    }

    [Test]
    public async Task UpdateStatus_DelegatesToMediatorAndReturnsNoContent()
    {
        _mediatorMock.Setup(m => m.Send(It.IsAny<UpdateOrderStatusCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Unit.Value);

        var result = await _controller.UpdateStatus(3, "Shipped");

        Assert.That(result, Is.InstanceOf<NoContentResult>());
        _mediatorMock.Verify(m => m.Send(It.IsAny<UpdateOrderStatusCommand>(), It.IsAny<CancellationToken>()), Times.Once);
    }
}

[TestFixture]
public class AuthControllerTests
{
    private Mock<IAuthService> _authServiceMock = null!;
    private AuthController _controller = null!;

    [SetUp]
    public void SetUp()
    {
        _authServiceMock = new Mock<IAuthService>();
        _controller = new AuthController(_authServiceMock.Object);
    }

    [Test]
    public async Task Register_WhenSuccessful_ReturnsOk()
    {
        var dto = new UserRegisterDto { Email = "test@example.com" };
        _authServiceMock.Setup(s => s.RegisterAsync(dto))
            .ReturnsAsync(new AuthResponseDto { Email = dto.Email, Token = "token" });

        var result = await _controller.Register(dto);

        Assert.That(result, Is.InstanceOf<OkObjectResult>());
    }

    [Test]
    public async Task Register_WhenEmailAlreadyExists_ReturnsBadRequest()
    {
        var dto = new UserRegisterDto { Email = "test@example.com" };
        _authServiceMock.Setup(s => s.RegisterAsync(dto))
            .ThrowsAsync(new InvalidOperationException("duplicate"));

        var result = await _controller.Register(dto);

        Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
    }

    [Test]
    public async Task Login_WhenSuccessful_ReturnsOk()
    {
        var dto = new UserLoginDto { Email = "test@example.com", Password = "secret" };

        _authServiceMock.Setup(s => s.LoginAsync(dto))
            .ReturnsAsync(("access-token", "refresh-token"));

        var result = await _controller.Login(dto);

        Assert.That(result, Is.InstanceOf<OkObjectResult>());
    }

    [Test]
    public async Task Login_WhenCredentialsAreInvalid_ReturnsUnauthorized()
    {
        var dto = new UserLoginDto { Email = "test@example.com", Password = "wrong" };
        _authServiceMock.Setup(s => s.LoginAsync(dto))
            .ThrowsAsync(new UnauthorizedAccessException("invalid credentials"));

        var result = await _controller.Login(dto);

        Assert.That(result, Is.InstanceOf<UnauthorizedObjectResult>());
    }
}
