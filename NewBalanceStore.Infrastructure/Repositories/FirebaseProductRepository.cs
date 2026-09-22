using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.Extensions.Configuration;
using NewBalanceStore.Domain.Entities;
using NewBalanceStore.Domain.Interfaces; 

namespace NewBalanceStore.Infrastructure.Repositories;

public class FirebaseProductRepository : IProductRepository
{
    private readonly FirebaseClient _firebaseClient;
    private const string CollectionName = "products";

    public FirebaseProductRepository(Microsoft.Extensions.Configuration.IConfiguration config)
    {
        var databaseUrl = config["Firebase:DatabaseUrl"]
            ?? throw new InvalidOperationException("Firebase:DatabaseUrl не настроено в appsettings.json");

        _firebaseClient = new FirebaseClient(databaseUrl);
    }

    public async Task<List<Product>> GetAllAsync()
    {
        var objects = await _firebaseClient
            .Child(CollectionName)
            .OnceAsync<Newtonsoft.Json.Linq.JObject>();

        var productsList = new List<Product>();

        foreach (var item in objects)
        {
            try
            {
                var product = item.Object?.ToObject<Product>();
                if (product != null)
                {
                    if (int.TryParse(item.Key, out int parsedId))
                    {
                        product.Id = parsedId;
                    }
                    productsList.Add(product);
                }
            }
            catch
            {
                continue;
            }
        }

        return productsList;
    }

    public async Task<Product?> GetByIdAsync(string id)
    {
        var product = await _firebaseClient
            .Child($"{CollectionName}/{id}")
            .OnceSingleAsync<Product>();

        if (product != null && int.TryParse(id, out int parsedId))
        {
            product.Id = parsedId;
        }

        return product;
    }

    public async Task CreateAsync(Product item)
    {
        
        if (item.Id <= 0)
        {
            
            item.Id = (int)(DateTime.UtcNow.Ticks % int.MaxValue);
        }

        await _firebaseClient
            .Child($"{CollectionName}/{item.Id}")
            .PutAsync(item);
    }

    public async Task UpdateAsync(Product item)
    {
        await _firebaseClient
            .Child($"{CollectionName}/{item.Id}")
            .PutAsync(item);
    }

    public async Task DeleteAsync(string id)
    {
        await _firebaseClient
            .Child($"{CollectionName}/{id}")
            .DeleteAsync();
    }
}