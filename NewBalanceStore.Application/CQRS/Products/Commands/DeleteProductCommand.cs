using ErrorOr;
using MediatR;

namespace NewBalanceStore.Application.CQRS.Products.Commands;

public record DeleteProductCommand(string Id) : IRequest<ErrorOr<Success>>;