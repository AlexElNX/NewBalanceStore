using NewBalanceStore.Domain.Entities;

namespace NewBalanceStore.Domain.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order?> GetByIdAsync(int id);
        Task<IEnumerable<Order>> GetAllAsync();
        Task CreateAsync(Order order);
        Task UpdateStatusAsync(int id, string status);
    }
}