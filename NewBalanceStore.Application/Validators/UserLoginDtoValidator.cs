using FluentValidation;
using NewBalanceStore.Application.DTOs;

namespace NewBalanceStore.Application.Validators;

public class UserLoginDtoValidator : AbstractValidator<UserLoginDto>
{
    public UserLoginDtoValidator()
    {
        RuleFor(u => u.Email)
            .NotEmpty().WithMessage("Email обязателен для заполнения.")
            .EmailAddress().WithMessage("Некорректный формат email.");

        RuleFor(u => u.Password)
            .NotEmpty().WithMessage("Пароль обязателен для заполнения.");
    }
}
