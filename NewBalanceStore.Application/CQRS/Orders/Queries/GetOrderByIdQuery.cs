using MediatR;
using NewBalanceStore.Application.DTOs;

namespace NewBalanceStore.Application.CQRS.Orders.Queries;

public record GetOrderByIdQuery(int Id) : IRequest<OrderDto?>;