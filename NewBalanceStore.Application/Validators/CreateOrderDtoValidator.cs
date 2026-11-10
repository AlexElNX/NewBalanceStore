using FluentValidation;
using NewBalanceStore.Application.DTOs;

namespace NewBalanceStore.Application.Validators;

public class CreateOrderDtoValidator : AbstractValidator<CreateOrderDto>
{
    public CreateOrderDtoValidator()
    {
        RuleFor(o => o.CustomerName)
            .NotEmpty().WithMessage("Имя покупателя обязательно.");

        RuleFor(o => o.CustomerEmail)
            .EmailAddress().When(o => !string.IsNullOrEmpty(o.CustomerEmail))
            .WithMessage("Некорректный формат email.");

        RuleFor(o => o.Items)
            .NotEmpty().WithMessage("Заказ должен содержать хотя бы один товар.");
    }
}
