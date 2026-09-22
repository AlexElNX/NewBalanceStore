using Firebase.Database;
using Firebase.Database.Query;
using NewBalanceStore.Domain.Entities;
using NewBalanceStore.Domain.Interfaces;
using Newtonsoft.Json.Linq;

namespace NewBalanceStore.Infrastructure.Repositories
{
    public class FirebaseOrderRepository : IOrderRepository
    {
        private readonly FirebaseClient _firebaseClient;
        private const string CollectionName = "orders";

        public FirebaseOrderRepository(FirebaseClient firebaseClient)
        {
            _firebaseClient = firebaseClient;
        }

        public async Task CreateAsync(Order order)
        {
            if (order.Id <= 0)
            {
                order.Id = (int)(DateTime.UtcNow.Ticks % int.MaxValue);
            }

            await _firebaseClient
                .Child($"{CollectionName}/{order.Id}")
                .PutAsync(order);
        }

        public async Task<Order?> GetByIdAsync(int id)
        {
            var order = await _firebaseClient
                .Child($"{CollectionName}/{id}")
                .OnceSingleAsync<Order>();

            if (order != null)
            {
                order.Id = id;
            }

            return order;
        }

        public async Task<IEnumerable<Order>> GetAllAsync()
        {
            var objects = await _firebaseClient
                .Child(CollectionName)
                .OnceAsync<JObject>();

            var ordersList = new List<Order>();

            foreach (var item in objects)
            {
                try
                {
                    var order = item.Object?.ToObject<Order>();
                    if (order != null)
                    {
                        if (int.TryParse(item.Key, out int parsedId))
                        {
                            order.Id = parsedId;
                        }
                        ordersList.Add(order);
                    }
                }
                catch
                {
                    continue;
                }
            }

            return ordersList;
        }

        public async Task UpdateStatusAsync(int id, string status)
        {
            var order = await GetByIdAsync(id);
            if (order != null)
            {
                order.Status = status;
                await _firebaseClient
                    .Child($"{CollectionName}/{id}")
                    .PutAsync(order);
            }
        }
    }
}