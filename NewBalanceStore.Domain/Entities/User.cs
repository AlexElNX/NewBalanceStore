using System;
using NewBalanceStore.Domain.Enums;

namespace NewBalanceStore.Domain.Entities;

public class User
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Customer;

    // Вспомогательное свойство для получения полного имени
    public string FullName => $"{FirstName} {LastName}".Trim();
}