using MediatR;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace NewBalanceStore.Application.Common.Caching;

public class CachingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly IMemoryCache _memoryCache;
    private readonly ILogger<CachingBehavior<TRequest, TResponse>> _logger;

    public CachingBehavior(IMemoryCache memoryCache, ILogger<CachingBehavior<TRequest, TResponse>> logger)
    {
        _memoryCache = memoryCache;
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (request is not ICachableRequest cachable)
        {
            return await next();
        }

        if (_memoryCache.TryGetValue(cachable.CacheKey, out TResponse? cachedResponse))
        {
            _logger.LogInformation("[Cache Hit] Данные получены из кеша по ключу: {CacheKey}", cachable.CacheKey);
            return cachedResponse!;
        }

        _logger.LogInformation("[Cache Miss] Данные запрашиваются из источника по ключу: {CacheKey}", cachable.CacheKey);


        var response = await next();

        var cacheOptions = new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = cachable.SlidingExpiration ?? TimeSpan.FromMinutes(5)
        };

        _memoryCache.Set(cachable.CacheKey, response, cacheOptions);

        return response;
    }
}