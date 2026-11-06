using ErrorOr;
using MediatR;
using NewBalanceStore.Application.Common.Caching;
using NewBalanceStore.Application.DTOs;

namespace NewBalanceStore.Application.CQRS.Products.Queries;

public record GetProductsQuery : IRequest<ErrorOr<List<ProductDto>>>, ICachableRequest
{
    public string CacheKey => "products-all";
    public TimeSpan? SlidingExpiration => TimeSpan.FromMinutes(10);
}