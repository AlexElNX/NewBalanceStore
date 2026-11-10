using FluentValidation;
using NewBalanceStore.Application.CQRS.Orders.Commands;

namespace NewBalanceStore.Application.Validators;

public class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
{
    public CreateOrderCommandValidator()
    {
        RuleFor(c => c.Dto)
            .NotNull().WithMessage("Данные заказа обязательны.")
            .SetValidator(new CreateOrderDtoValidator());
    }
}
