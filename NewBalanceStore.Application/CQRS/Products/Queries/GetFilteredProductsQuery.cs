using MediatR;
using NewBalanceStore.Application.DTOs;

namespace NewBalanceStore.Application.CQRS.Products.Queries;

public record GetFilteredProductsQuery(ProductFilterDto Filter) : IRequest<IEnumerable<ProductDto>>;