using System;
using System.Collections.Generic;
using System.Text;

using NewBalanceStore.Application.DTOs;

namespace NewBalanceStore.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(UserRegisterDto registerDto);
    Task<AuthResponseDto> LoginAsync(UserLoginDto loginDto);
}