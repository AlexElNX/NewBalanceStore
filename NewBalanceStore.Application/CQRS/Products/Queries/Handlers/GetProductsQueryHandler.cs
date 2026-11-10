using ErrorOr;
using MediatR;
using NewBalanceStore.Application.DTOs;
using NewBalanceStore.Application.Interfaces;

namespace NewBalanceStore.Application.CQRS.Products.Queries.Handlers;

public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, ErrorOr<List<ProductDto>>>
{
    private readonly IProductService _productService;

    public GetProductsQueryHandler(IProductService productService)
    {
        _productService = productService;
    }

    public async Task<ErrorOr<List<ProductDto>>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        var products = await _productService.GetAllAsync();
        return products.ToList();
    }
}
