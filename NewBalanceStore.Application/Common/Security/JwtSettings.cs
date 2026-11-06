namespace NewBalanceStore.Application.Common.Security;

public class JwtSettings
{
    public const string SectionName = "Jwt";
    public string Secret { get; init; } = null!;
    public string Issuer { get; init; } = null!;
    public string Audience { get; init; } = null!;
    public int ExpiryInMinutes { get; init; }
}