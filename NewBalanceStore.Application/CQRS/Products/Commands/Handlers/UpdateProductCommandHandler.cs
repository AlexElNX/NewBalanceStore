using ErrorOr;
using MediatR;
using Microsoft.Extensions.Caching.Memory;
using NewBalanceStore.Application.Interfaces;

namespace NewBalanceStore.Application.CQRS.Products.Commands.Handlers;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, ErrorOr<Success>>
{
    private readonly IProductService _productService;
    private readonly IMemoryCache _memoryCache;

    public UpdateProductCommandHandler(IProductService productService, IMemoryCache memoryCache)
    {
        _productService = productService;
        _memoryCache = memoryCache;
    }

    public async Task<ErrorOr<Success>> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var success = await _productService.UpdateAsync(request.Id, request.Dto);

        if (!success)
        {
            return Error.NotFound("Product.NotFound", $"Товар с ID '{request.Id}' не найден.");
        }

        _memoryCache.Remove("products-all");

        return Result.Success;
    }
}