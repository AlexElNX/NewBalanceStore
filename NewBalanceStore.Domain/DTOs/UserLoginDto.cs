using System;
using System.Collections.Generic;
using System.Text;

namespace NewBalanceStore.Application.DTOs;

/// <summary>
/// DTO для передачі облікових даних користувача при процедурі входу (Login).
/// </summary>
public class UserLoginDto
{
    /// <summary>
    /// Адреса електронної пошти (логін користувача).
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Пароль користувача у відкритому вигляді для перевірки на сервері.
    /// </summary>
    public string Password { get; set; } = string.Empty;
}

