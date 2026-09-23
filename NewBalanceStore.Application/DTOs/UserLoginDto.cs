using System;
using System.Collections.Generic;
using System.Text;

namespace NewBalanceStore.Application.DTOs;

public class UserLoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
