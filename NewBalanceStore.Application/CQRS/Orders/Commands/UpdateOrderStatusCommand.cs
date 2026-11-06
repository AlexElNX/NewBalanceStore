using MediatR;

namespace NewBalanceStore.Application.CQRS.Orders.Commands;

public record UpdateOrderStatusCommand(int Id, string Status) : IRequest<Unit>;