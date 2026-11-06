using ErrorOr;
using MediatR;
using NewBalanceStore.Application.DTOs;
using NewBalanceStore.Application.Interfaces;

namespace NewBalanceStore.Application.CQRS.Products.Queries.Handlers;

public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ErrorOr<ProductDto>>
{
    private readonly IProductService _productService;

    public GetProductByIdQueryHandler(IProductService productService)
    {
        _productService = productService;
    }

    public async Task<ErrorOr<ProductDto>> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var product = await _productService.GetByIdAsync(request.Id);

        if (product is null)
        {
            return Error.NotFound(
                code: "Product.NotFound",
                description: $"Товар с ID '{request.Id}' не найден."
            );
        }

        return product;
    }
}