using Microsoft.Extensions.Options;
using NewBalanceStore.Application.Common.Security;
using NewBalanceStore.Infrastructure.Authentication;
using NUnit.Framework;

namespace NewBalanceStore.UnitTests.Services;

[TestFixture]
public class JwtTokenGeneratorTests
{
    [Test]
    public void GenerateAccessToken_ReturnsValidJwtString()
    {
        var jwtSettings = Options.Create(new JwtSettings
        {
            Secret = "super_secret_key_which_is_long_enough_for_hashing_12345",
            ExpiryInMinutes = 60,
            Issuer = "NewBalanceStoreApi",
            Audience = "NewBalanceStoreClient"
        });

        var generator = new JwtTokenGenerator(jwtSettings);
        var roles = new List<string> { "Customer" };

        var token = generator.GenerateAccessToken("user-123", "test@example.com", roles);

        Assert.That(token, Is.Not.Null.And.Not.Empty);
    }
}