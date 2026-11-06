using System;
using NewBalanceStore.Domain.Enums;

namespace NewBalanceStore.Domain.Entities;

/// <summary>
/// Доменна сутність облікового запису користувача системи.
/// Представляє покупця або адміністратора з відповідними правами доступу.
/// </summary>
public class User
{
    /// <summary>
    /// Унікальний ідентифікатор користувача у системі.
    /// </summary>
    public string Id { get; set; } = Guid.NewGuid().ToString();

    /// <summary>
    /// Унікальна адреса електронної пошти користувача, що слугує логіном.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Криптографічний хеш пароля, згенерований за допомогою алгоритму PBKDF2 / PasswordHasher.
    /// </summary>
    public string PasswordHash { get; set; } = string.Empty;

    /// <summary>
    /// Ім'я користувача.
    /// </summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// Прізвище користувача.
    /// </summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// Номер мобільного телефону користувача.
    /// </summary>
    public string Phone { get; set; } = string.Empty;

    /// <summary>
    /// Роль користувача в системі, яка визначає рівень привілеїв (Customer або Admin).
    /// </summary>
    public UserRole Role { get; set; } = UserRole.Customer;

    /// <summary>
    /// Токен оновлення (Refresh Token) для забезпечення довготривалих сесій.
    /// </summary>
    public string? RefreshToken { get; set; }

    /// <summary>
    /// Дата та час завершення терміну дії Refresh Token (в UTC).
    /// </summary>
    public DateTime? RefreshTokenExpiryTime { get; set; }

    /// <summary>
    /// Обчислювана властивість: повне ім'я та прізвище користувача.
    /// </summary>
    public string FullName => $"{FirstName} {LastName}".Trim();
}