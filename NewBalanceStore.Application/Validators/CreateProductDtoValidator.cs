using FluentValidation;
using NewBalanceStore.Application.DTOs;

namespace NewBalanceStore.Application.Validators;

public class CreateProductDtoValidator : AbstractValidator<CreateProductDto>
{
    public CreateProductDtoValidator()
    {
        RuleFor(p => p.Name)
            .NotEmpty().WithMessage("Название товара обязательно для заполнения.")
            .MaximumLength(100).WithMessage("Название не должно превышать 100 символов.");

        RuleFor(p => p.Price)
            .GreaterThan(0).WithMessage("Цена товара должна быть больше нуля.");

        RuleFor(p => p.Category)
            .NotEmpty().WithMessage("Категория товара обязательна.");
    }
}