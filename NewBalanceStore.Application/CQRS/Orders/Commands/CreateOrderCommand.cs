using MediatR;
using NewBalanceStore.Application.DTOs;

namespace NewBalanceStore.Application.CQRS.Orders.Commands;

public record CreateOrderCommand(CreateOrderDto Dto) : IRequest<OrderDto>;