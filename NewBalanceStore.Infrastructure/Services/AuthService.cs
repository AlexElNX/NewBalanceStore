using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using NewBalanceStore.Application.DTOs;
using NewBalanceStore.Application.Interfaces;
using NewBalanceStore.Domain.Entities;
using NewBalanceStore.Domain.Enums;

namespace NewBalanceStore.Infrastructure.Services;

public class AuthService : IAuthService
{
    private static readonly List<User> _users = new();
    private readonly IConfiguration _configuration;

    public AuthService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public Task<AuthResponseDto> RegisterAsync(UserRegisterDto registerDto)
    {
        if (_users.Any(u => u.Email.Equals(registerDto.Email, StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidOperationException("Пользователь с таким Email уже существует.");
        }

        var names = registerDto.FullName.Split(' ', 2);
        var firstName = names.Length > 0 ? names[0] : registerDto.FullName;
        var lastName = names.Length > 1 ? names[1] : string.Empty;

        var user = new User
        {
            Email = registerDto.Email,
            PasswordHash = HashPassword(registerDto.Password),
            FirstName = firstName,
            LastName = lastName,
            Role = UserRole.Customer
        };

        _users.Add(user);

        var token = GenerateJwtToken(user);

        return Task.FromResult(new AuthResponseDto
        {
            Token = token,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role.ToString()
        });
    }

    public Task<AuthResponseDto> LoginAsync(UserLoginDto loginDto)
    {
        var user = _users.FirstOrDefault(u => u.Email.Equals(loginDto.Email, StringComparison.OrdinalIgnoreCase));
        if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Неверный Email или пароль.");
        }

        var token = GenerateJwtToken(user);

        return Task.FromResult(new AuthResponseDto
        {
            Token = token,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role.ToString()
        });
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = Encoding.UTF8.GetBytes(jwtSettings["Secret"]!);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("fullName", user.FullName)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpiryInMinutes"] ?? "60")),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }

    private static string HashPassword(string password)
    {
        return Convert.ToBase64String(Encoding.UTF8.GetBytes(password));
    }

    private static bool VerifyPassword(string password, string passwordHash)
    {
        return HashPassword(password) == passwordHash;
    }
}