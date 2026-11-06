using ErrorOr;
using MediatR;
using NewBalanceStore.Application.DTOs;
using NewBalanceStore.Application.Interfaces;

namespace NewBalanceStore.Application.CQRS.Products.Commands.Handlers;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, ErrorOr<ProductDto>>
{
    private readonly IProductService _productService;

    public CreateProductCommandHandler(IProductService productService)
    {
        _productService = productService;
    }

    public async Task<ErrorOr<ProductDto>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var createdProduct = await _productService.CreateAsync(request.Dto);

        if (createdProduct is null)
        {
            return Error.Failure("Product.CreateFailed", "Не удалось создать товар в базе данных.");
        }

        return createdProduct;
    }
}