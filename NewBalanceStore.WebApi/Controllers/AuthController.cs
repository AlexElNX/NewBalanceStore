using Microsoft.AspNetCore.Mvc;
using NewBalanceStore.Application.DTOs;
using NewBalanceStore.Application.Interfaces;

namespace NewBalanceStore.WebApi.Controllers;

/// <summary>
/// Контролер автентифікації та реєстрації облікових записів користувачів.
/// Забезпечує отримання токенів авторизації для доступу до захищених операцій API.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    /// <summary>
    /// Ініціалізує новий екземпляр контролера <see cref="AuthController"/>.
    /// </summary>
    /// <param name="authService">Сервіс автентифікації користувачів.</param>
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Реєстрація нового користувача в системі.
    /// </summary>
    /// <param name="registerDto">Об'єкт із реєстраційними даними (Email, пароль, повне ім'я).</param>
    /// <returns>Відповідь із даними створеного профілю та JWT-токеном.</returns>
    /// <response code="200">Користувача успішно зареєстровано, повернуто токен доступу.</response>
    /// <response code="400">Помилка валідації або користувач із зазначеним Email уже існує.</response>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto registerDto)
    {
        try
        {
            var result = await _authService.RegisterAsync(registerDto);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Вхід користувача в систему за допомогою Email та пароля.
    /// Повертає Access Token та дані користувача в тілі, а Refresh Token записує у захищену HttpOnly куку.
    /// </summary>
    /// <param name="loginDto">Облікові дані користувача.</param>
    /// <response code="200">Автентифікація успішна, надано токен доступу.</response>
    /// <response code="401">Невірний логін або пароль.</response>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] UserLoginDto loginDto)
    {
        try
        {
            var (accessToken, refreshToken) = await _authService.LoginAsync(loginDto);

            SetRefreshTokenCookie(refreshToken);

            var response = new AuthResponseDto
            {
                Token = accessToken,
                Email = loginDto.Email
            };

            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Оновлення Access Token за допомогою валідного Refresh Token із куки.
    /// </summary>
    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken()
    {
        if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken) || string.IsNullOrEmpty(refreshToken))
        {
            return Unauthorized(new { message = "Refresh Token відсутній у куках." });
        }

        try
        {
            var (newAccessToken, newRefreshToken) = await _authService.RefreshTokenAsync(refreshToken);

            SetRefreshTokenCookie(newRefreshToken);

            return Ok(new { AccessToken = newAccessToken });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    private void SetRefreshTokenCookie(string refreshToken)
    {
        if (ControllerContext?.HttpContext?.Response == null) return;

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7)
        };

        Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
    }
}