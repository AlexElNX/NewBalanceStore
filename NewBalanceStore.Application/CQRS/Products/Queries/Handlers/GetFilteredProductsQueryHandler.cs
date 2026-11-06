using MediatR;
using NewBalanceStore.Application.DTOs;
using NewBalanceStore.Application.Interfaces;

namespace NewBalanceStore.Application.CQRS.Products.Queries.Handlers;

public class GetFilteredProductsQueryHandler : IRequestHandler<GetFilteredProductsQuery, IEnumerable<ProductDto>>
{
    private readonly IProductService _productService;

    public GetFilteredProductsQueryHandler(IProductService productService)
    {
        _productService = productService;
    }

    public async Task<IEnumerable<ProductDto>> Handle(GetFilteredProductsQuery request, CancellationToken cancellationToken)
    {
        return await _productService.GetFilteredProductsAsync(request.Filter);
    }
}