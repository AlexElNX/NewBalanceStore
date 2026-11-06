namespace NewBalanceStore.Application.Common.Caching;

public interface ICachableRequest
{
    string CacheKey { get; }
    TimeSpan? SlidingExpiration { get; }
}