using NewBalanceStore.Application.DTOs;

namespace NewBalanceStore.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(UserRegisterDto registerDto);
    Task<(string AccessToken, string RefreshToken)> LoginAsync(UserLoginDto loginDto);
    Task<(string AccessToken, string RefreshToken)> RefreshTokenAsync(string refreshToken);
}