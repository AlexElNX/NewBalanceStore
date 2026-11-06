using NewBalanceStore.Infrastructure.Authentication;
using Microsoft.Extensions.Configuration;
using Moq;
using NewBalanceStore.Application.DTOs;
using NewBalanceStore.Application.Common.Security;
using NewBalanceStore.Domain.Entities;
using NewBalanceStore.Domain.Interfaces;
using NewBalanceStore.Infrastructure.Services;
using NUnit.Framework;

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

        var fakeUserRepository = new FakeUserRepository();
        var emailServiceMock = new Mock<IEmailService>();

        var jwtTokenGeneratorMock = new Mock<IJwtTokenGenerator>();
        jwtTokenGeneratorMock
            .Setup(g => g.GenerateAccessToken(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<IList<string>>()))
            .Returns("test-access-token");

        _authService = new AuthService(fakeUserRepository, jwtTokenGeneratorMock.Object);
    }

    [Test]
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
        Assert.That(result.Token, Is.Not.Empty);
        Assert.That(result.Email, Is.EqualTo(registerDto.Email));
        Assert.That(result.FullName, Is.EqualTo("John Doe"));
    }

    [Test]
    public async Task RegisterAsync_ShouldThrowException_WhenEmailAlreadyExists()
    {
        var email = $"duplicate_{Guid.NewGuid()}@example.com";
        var registerDto1 = new UserRegisterDto { Email = email, Password = "Password123!", FullName = "User One" };
        var registerDto2 = new UserRegisterDto { Email = email.ToUpperInvariant(), Password = "Password123!", FullName = "User Two" };

        await _authService.RegisterAsync(registerDto1);

        await Assert.ThrowsAsync<InvalidOperationException>(() => _authService.RegisterAsync(registerDto2));
    }

    [Test]
    public async Task LoginAsync_ShouldReturnTokens_WhenCredentialsAreValid()
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

        var (accessToken, refreshToken) = await _authService.LoginAsync(loginDto);

        Assert.NotNull(accessToken);
        Assert.That(accessToken, Is.Not.Empty);
        Assert.NotNull(refreshToken);
        Assert.That(refreshToken, Is.Not.Empty);
    }

    [Test]
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

    [Test]
    public async Task LoginAsync_ShouldReturnTokens_WhenEmailDiffersOnlyByCase()
    {
        var email = $"case_{Guid.NewGuid()}@example.com";
        const string password = "CorrectPassword123!";
        await _authService.RegisterAsync(new UserRegisterDto
        {
            Email = email,
            Password = password,
            FullName = "Alex Smith"
        });

        var (accessToken, refreshToken) = await _authService.LoginAsync(new UserLoginDto
        {
            Email = email.ToUpperInvariant(),
            Password = password
        });

        Assert.NotNull(accessToken);
        Assert.That(accessToken, Is.Not.Empty);
        Assert.NotNull(refreshToken);
    }

    [Test]
    public async Task LoginAsync_ShouldThrowException_WhenEmailDoesNotExist()
    {
        var loginDto = new UserLoginDto
        {
            Email = $"missing_{Guid.NewGuid()}@example.com",
            Password = "Password123!"
        };

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _authService.LoginAsync(loginDto));
    }

    public class FakeUserRepository : IUserRepository
    {
        private readonly List<User> _users = new();

        public Task<User?> GetByEmailAsync(string email)
        {
            var user = _users.FirstOrDefault(u => u.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
            return Task.FromResult(user);
        }

        public Task CreateAsync(User user)
        {
            if (string.IsNullOrEmpty(user.Id))
            {
                user.Id = Guid.NewGuid().ToString();
            }
            _users.Add(user);
            return Task.CompletedTask;
        }

        public Task<IEnumerable<User>> GetAllAsync()
        {
            return Task.FromResult<IEnumerable<User>>(_users);
        }

        public Task UpdateAsync(User user)
        {
            var existingUser = _users.FirstOrDefault(u => u.Id == user.Id);
            if (existingUser != null)
            {
                _users.Remove(existingUser);
                _users.Add(user);
            }
            return Task.CompletedTask;
        }
    }
}