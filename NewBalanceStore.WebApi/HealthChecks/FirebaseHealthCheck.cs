using Firebase.Database;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace NewBalanceStore.WebApi.HealthChecks;

public class FirebaseHealthCheck : IHealthCheck
{
    private readonly FirebaseClient _firebaseClient;

    public FirebaseHealthCheck(FirebaseClient firebaseClient)
    {
        _firebaseClient = firebaseClient;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            await _firebaseClient.Child(".info/connected").OnceAsync<bool>();

            return HealthCheckResult.Healthy("Firebase Realtime Database доступна и работает стабильно.");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Ошибка соединения с Firebase Realtime Database.", ex);
        }
    }
}