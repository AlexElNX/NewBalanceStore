using Microsoft.Extensions.Configuration;
using Moq;
using NewBalanceStore.Infrastructure.Services;
using NUnit.Framework;

namespace NewBalanceStore.UnitTests.Services;

[TestFixture]
public class EmailServiceTests
{
    private Mock<IConfiguration> _configurationMock = null!;
    private EmailService _emailService = null!;

    [SetUp]
    public void SetUp()
    {
        _configurationMock = new Mock<IConfiguration>();
        _configurationMock.Setup(c => c["EmailSettings:Host"]).Returns("localhost");
        _configurationMock.Setup(c => c["EmailSettings:Port"]).Returns("1025");
        _configurationMock.Setup(c => c["EmailSettings:SendEmail"]).Returns("test@newbalance.com");

        _emailService = new EmailService(_configurationMock.Object);
    }

    [Test]
    public async Task SendVerificationEmailAsync_WhenTemplateMissingOrPresent_ExecutesWithoutCrashing()
    {
        _ = Assert.DoesNotThrowAsync(async () =>
            await _emailService.SendVerificationEmailAsync("user@example.com", "123456")
        );
    }
}