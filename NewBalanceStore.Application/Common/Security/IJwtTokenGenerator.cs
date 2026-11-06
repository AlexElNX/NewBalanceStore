namespace NewBalanceStore.Application.Common.Security;

public interface IJwtTokenGenerator
{
    string GenerateAccessToken(string userId, string email, IList<string> roles);
}