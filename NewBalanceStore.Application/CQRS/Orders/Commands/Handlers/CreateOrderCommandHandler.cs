using MediatR;
using NewBalanceStore.Application.DTOs;
using NewBalanceStore.Application.Services;

namespace NewBalanceStore.Application.CQRS.Orders.Commands.Handlers;

public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, OrderDto>
{
    private readonly IOrderService _orderService;

    public CreateOrderCommandHandler(IOrderService orderService)
    {
        _orderService = orderService;
    }

    public async Task<OrderDto> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        return await _orderService.CreateOrderAsync(request.Dto);
    }
}