using Microsoft.Extensions.Configuration;
using NewBalanceStore.Application.Common.Security;
using NewBalanceStore.Application.DTOs;
using NewBalanceStore.Application.Interfaces;
using NewBalanceStore.Domain.Entities;
using NewBalanceStore.Domain.Interfaces;
using System.Security.Cryptography;

namespace NewBalanceStore.Infrastructure.Authentication;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(
        IUserRepository userRepository,
        IJwtTokenGenerator jwtTokenGenerator)
    {
        _userRepository = userRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<AuthResponseDto> RegisterAsync(UserRegisterDto registerDto)
    {
        var existingUser = await _userRepository.GetByEmailAsync(registerDto.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("Користувач із таким email вже існує.");
        }

        var user = new User
        {
            Email = registerDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
            FirstName = registerDto.FullName,
            Role = Domain.Enums.UserRole.Customer
        };

        await _userRepository.CreateAsync(user);

        var roles = new List<string> { user.Role.ToString() };
        var accessToken = _jwtTokenGenerator.GenerateAccessToken(user.Id, user.Email, roles);

        return new AuthResponseDto
        {
            Token = accessToken,
            Email = user.Email,
            Role = user.Role.ToString(),
            FullName = user.FirstName
        };
    }

    public async Task<(string AccessToken, string RefreshToken)> LoginAsync(UserLoginDto loginDto)
    {
        var user = await _userRepository.GetByEmailAsync(loginDto.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Невірний email або пароль.");
        }

        var roles = new List<string> { user.Role.ToString() };
        var accessToken = _jwtTokenGenerator.GenerateAccessToken(user.Id, user.Email, roles);

        var refreshToken = GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

        await _userRepository.UpdateAsync(user);

        return (accessToken, refreshToken);
    }

    public async Task<(string AccessToken, string RefreshToken)> RefreshTokenAsync(string refreshToken)
    {
        var users = await _userRepository.GetAllAsync();
        var user = users.FirstOrDefault(u => u.RefreshToken == refreshToken);

        if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            throw new UnauthorizedAccessException("Недійсний або прострочений Refresh Token.");
        }

        var roles = new List<string> { user.Role.ToString() };
        var newAccessToken = _jwtTokenGenerator.GenerateAccessToken(user.Id, user.Email, roles);
        var newRefreshToken = GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

        await _userRepository.UpdateAsync(user);

        return (newAccessToken, newRefreshToken);
    }

    private static string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }
}