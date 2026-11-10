using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using NewBalanceStore.WebApi.Middleware;
using NUnit.Framework;

namespace NewBalanceStore.UnitTests.Middleware;

[TestFixture]
public class GlobalExceptionHandlerTests
{
    private Mock<ILogger<GlobalExceptionHandler>> _loggerMock = null!;
    private GlobalExceptionHandler _handler = null!;

    [SetUp]
    public void SetUp()
    {
        _loggerMock = new Mock<ILogger<GlobalExceptionHandler>>();
        _handler = new GlobalExceptionHandler(_loggerMock.Object);
    }

    [Test]
    public async Task TryHandleAsync_WithValidationException_Returns400BadRequest()
    {
        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        var failures = new List<ValidationFailure> { new("Email", "Invalid email format") };
        var exception = new ValidationException(failures);

        var result = await _handler.TryHandleAsync(context, exception, CancellationToken.None);

        Assert.That(result, Is.True);
        Assert.That(context.Response.StatusCode, Is.EqualTo(StatusCodes.Status400BadRequest));
    }

    [Test]
    public async Task TryHandleAsync_WithKeyNotFoundException_Returns404NotFound()
    {
        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();
        var exception = new KeyNotFoundException("Not found");

        var result = await _handler.TryHandleAsync(context, exception, CancellationToken.None);

        Assert.That(result, Is.True);
        Assert.That(context.Response.StatusCode, Is.EqualTo(StatusCodes.Status404NotFound));
    }

    [Test]
    public async Task TryHandleAsync_WithUnauthorizedAccessException_Returns401Unauthorized()
    {
        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();
        var exception = new UnauthorizedAccessException("Unauthorized");

        var result = await _handler.TryHandleAsync(context, exception, CancellationToken.None);

        Assert.That(result, Is.True);
        Assert.That(context.Response.StatusCode, Is.EqualTo(StatusCodes.Status401Unauthorized));
    }

    [Test]
    public async Task TryHandleAsync_WithGenericException_Returns500InternalServerError()
    {
        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();
        var exception = new Exception("Server crash");

        var result = await _handler.TryHandleAsync(context, exception, CancellationToken.None);

        Assert.That(result, Is.True);
        Assert.That(context.Response.StatusCode, Is.EqualTo(StatusCodes.Status500InternalServerError));
    }
}