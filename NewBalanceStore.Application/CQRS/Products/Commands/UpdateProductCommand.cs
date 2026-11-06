using ErrorOr;
using MediatR;
using NewBalanceStore.Application.DTOs;

namespace NewBalanceStore.Application.CQRS.Products.Commands;

public record UpdateProductCommand(string Id, CreateProductDto Dto) : IRequest<ErrorOr<Success>>;