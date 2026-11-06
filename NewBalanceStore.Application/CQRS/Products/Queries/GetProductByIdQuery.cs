using ErrorOr;
using MediatR;
using NewBalanceStore.Application.DTOs;

namespace NewBalanceStore.Application.CQRS.Products.Queries;

public record GetProductByIdQuery(string Id) : IRequest<ErrorOr<ProductDto>>;