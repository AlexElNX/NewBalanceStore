using ErrorOr;
using MediatR;
using Microsoft.Extensions.Caching.Memory;
using NewBalanceStore.Application.Interfaces;

namespace NewBalanceStore.Application.CQRS.Products.Commands.Handlers;

public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, ErrorOr<Success>>
{
    private readonly IProductService _productService;

    private readonly IMemoryCache _memoryCache;
    public DeleteProductCommandHandler(IProductService productService, IMemoryCache memoryCache)
    {
        _productService = productService;
        _memoryCache = memoryCache;
    }

    public async Task<ErrorOr<Success>> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var success = await _productService.DeleteAsync(request.Id);

        if (!success)
        {
            return Error.NotFound("Product.NotFound", $"Товар с ID '{request.Id}' не найден.");
        }

        _memoryCache.Remove("products-all");

        return Result.Success;
    }
}