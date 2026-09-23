using Microsoft.Extensions.Configuration;
using NewBalanceStore.Application.DTOs;
using NewBalanceStore.Infrastructure.Services;
using Xunit;

namespace NewBalanceStore.UnitTests.Services;

public class AuthServiceTests
{
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        var inMemorySettings = new Dictionary<string, string>
        {
            {"Jwt:Secret", "SuperSecretKeyForTestingNewBalanceStoreApi2026!"},
            {"Jwt:Issuer", "TestIssuer"},
            {"Jwt:Audience", "TestAudience"},
            {"Jwt:ExpiryInMinutes", "60"}
        };

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings!)
            .Build();

        _authService = new AuthService(configuration);
    }

    [Fact]
    public async Task RegisterAsync_ShouldReturnAuthResponseDto_WhenUserIsNew()
    {
        var registerDto = new UserRegisterDto
        {
            Email = $"test_{Guid.NewGuid()}@example.com",
            Password = "Password123!",
            FullName = "John Doe"
        };

        var result = await _authService.RegisterAsync(registerDto);

        Assert.NotNull(result);
        Assert.NotNull(result.Token);
        Assert.NotEmpty(result.Token);
        Assert.Equal(registerDto.Email, result.Email);
        Assert.Equal("John Doe", result.FullName);
    }

    [Fact]
    public async Task RegisterAsync_ShouldThrowException_WhenEmailAlreadyExists()
    {
        var email = $"duplicate_{Guid.NewGuid()}@example.com";
        var registerDto1 = new UserRegisterDto { Email = email, Password = "Password123!", FullName = "User One" };
        var registerDto2 = new UserRegisterDto { Email = email, Password = "Password123!", FullName = "User Two" };

        await _authService.RegisterAsync(registerDto1);

        await Assert.ThrowsAsync<InvalidOperationException>(() => _authService.RegisterAsync(registerDto2));
    }

    [Fact]
    public async Task LoginAsync_ShouldReturnToken_WhenCredentialsAreValid()
    {
        var email = $"login_{Guid.NewGuid()}@example.com";
        var password = "CorrectPassword123!";

        await _authService.RegisterAsync(new UserRegisterDto
        {
            Email = email,
            Password = password,
            FullName = "Alex Smith"
        });

        var loginDto = new UserLoginDto { Email = email, Password = password };

        var result = await _authService.LoginAsync(loginDto);

        Assert.NotNull(result);
        Assert.NotNull(result.Token);
        Assert.Equal(email, result.Email);
    }

    [Fact]
    public async Task LoginAsync_ShouldThrowException_WhenPasswordIsInvalid()
    {
        var email = $"wrongpass_{Guid.NewGuid()}@example.com";
        await _authService.RegisterAsync(new UserRegisterDto
        {
            Email = email,
            Password = "CorrectPassword123!",
            FullName = "Alex Smith"
        });

        var loginDto = new UserLoginDto { Email = email, Password = "WrongPassword!" };

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _authService.LoginAsync(loginDto));
    }
}