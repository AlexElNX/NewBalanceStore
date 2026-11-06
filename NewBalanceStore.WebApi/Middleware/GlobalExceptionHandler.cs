using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace NewBalanceStore.WebApi.Middleware;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "Произошла ошибка при обработке запроса: {Message}", exception.Message);

        var (statusCode, title, errors) = exception switch
        {
            ValidationException validationEx => (
                StatusCodes.Status400BadRequest,
                "Ошибка валидации данных",
                (object)validationEx.Errors.ToDictionary(err => err.PropertyName, err => err.ErrorMessage)
            ),
            KeyNotFoundException => (
                StatusCodes.Status404NotFound,
                "Ресурс не найден",
                exception.Message
            ),
            UnauthorizedAccessException => (
                StatusCodes.Status401Unauthorized,
                "Ошибка авторизации",
                exception.Message
            ),
            _ => (
                StatusCodes.Status500InternalServerError,
                "Внутренняя ошибка сервера",
                "Произошла непредвиденная ошибка на стороне сервера."
            ),
        };

        httpContext.Response.StatusCode = statusCode;
        httpContext.Response.ContentType = "application/json";

        var response = new
        {
            Status = statusCode,
            Title = title,
            Errors = errors
        };

        await httpContext.Response.WriteAsJsonAsync(response, cancellationToken);

        return true;
    }
}