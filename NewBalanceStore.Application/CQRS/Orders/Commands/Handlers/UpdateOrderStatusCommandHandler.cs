using MediatR;
using NewBalanceStore.Application.Services;

namespace NewBalanceStore.Application.CQRS.Orders.Commands.Handlers;

public class UpdateOrderStatusCommandHandler : IRequestHandler<UpdateOrderStatusCommand, Unit>
{
    private readonly IOrderService _orderService;

    public UpdateOrderStatusCommandHandler(IOrderService orderService)
    {
        _orderService = orderService;
    }

    public async Task<Unit> Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
    {
        await _orderService.UpdateOrderStatusAsync(request.Id, request.Status);
        return Unit.Value;
    }
}