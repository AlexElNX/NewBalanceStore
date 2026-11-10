using FluentValidation;
using NewBalanceStore.Application.DTOs;

namespace NewBalanceStore.Application.Validators;

public class UserRegisterDtoValidator : AbstractValidator<UserRegisterDto>
{
    public UserRegisterDtoValidator()
    {
        RuleFor(u => u.Email)
            .NotEmpty().WithMessage("Email обязателен для заполнения.")
            .EmailAddress().WithMessage("Некорректный формат email.");

        RuleFor(u => u.Password)
            .NotEmpty().WithMessage("Пароль обязателен для заполнения.")
            .MinimumLength(6).WithMessage("Пароль должен содержать как минимум 6 символов.");

        RuleFor(u => u.FullName)
            .NotEmpty().WithMessage("Имя обязательно для заполнения.");
    }
}
