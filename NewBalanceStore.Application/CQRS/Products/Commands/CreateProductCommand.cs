using ErrorOr;
using MediatR;
using NewBalanceStore.Application.DTOs;

namespace NewBalanceStore.Application.CQRS.Products.Commands;

public record CreateProductCommand(CreateProductDto Dto) : IRequest<ErrorOr<ProductDto>>;