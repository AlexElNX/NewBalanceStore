using FluentValidation;
using NewBalanceStore.Application.CQRS.Products.Commands;

namespace NewBalanceStore.Application.Validators;

public class UpdateProductCommandValidator : AbstractValidator<UpdateProductCommand>
{
    public UpdateProductCommandValidator()
    {
        RuleFor(c => c.Id)
            .NotEmpty().WithMessage("Идентификатор товара обязателен для заполнения.");

        RuleFor(c => c.Dto)
            .NotNull().WithMessage("Данные товара обязательны для заполнения.")
            .SetValidator(new CreateProductDtoValidator());
    }
}
