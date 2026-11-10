using FluentValidation;
using NewBalanceStore.Application.CQRS.Products.Commands;

namespace NewBalanceStore.Application.Validators;

public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductCommandValidator()
    {
        RuleFor(c => c.Dto)
            .NotNull().WithMessage("Данные товара обязательны для заполнения.")
            .SetValidator(new CreateProductDtoValidator());
    }
}
