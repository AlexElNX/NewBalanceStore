using AutoMapper;
using NewBalanceStore.Application.DTOs;
using NewBalanceStore.Domain.Entities;
using NewBalanceStore.Domain.Interfaces;

namespace NewBalanceStore.Application.Services
{
    /// <summary>
    /// Контракт сервісу обробки та управління клієнтськими замовленнями.
    /// </summary>
    public interface IOrderService
    {
        /// <summary>
        /// Створює нове замовлення: отримує товари з каталогу та розраховує фінальну вартість
        /// та зберігає замовлення у базі даних.
        /// </summary>
        /// <param name="dto">Дані для оформлення замовлення.</param>
        /// <returns>Створене замовлення у форматі <see cref="OrderDto"/>.</returns>
        Task<OrderDto> CreateOrderAsync(CreateOrderDto dto);

        /// <summary>
        /// Отримує замовлення за його ідентифікатором.
        /// </summary>
        /// <param name="id">Числовий ідентифікатор замовлення.</param>
        /// <returns>Знайдене замовлення або <c>null</c>.</returns>
        Task<OrderDto?> GetOrderByIdAsync(int id);

        /// <summary>
        /// Отримує перелік усіх зареєстрованих замовлень.
        /// </summary>
        /// <returns>Колекція замовлень <see cref="OrderDto"/>.</returns>
        Task<IEnumerable<OrderDto>> GetAllOrdersAsync();

        /// <summary>
        /// Оновлює статус обробки замовлення (наприклад, переведення у статус "Shipped").
        /// </summary>
        /// <param name="id">Ідентифікатор замовлення.</param>
        /// <param name="status">Новий рядок статусу.</param>
        Task UpdateOrderStatusAsync(int id, string status);
    }

    /// <summary>
    /// Реалізація сервісу оформлення та керування замовленнями.
    /// Забезпечує цілісність цін шляхом перевірки актуальної вартості в каталозі товарів
    /// та підрахунку суми замовлення на серверному боці.
    /// </summary>
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        /// <summary>
        /// Ініціалізує новий екземпляр класу <see cref="OrderService"/>.
        /// </summary>
        /// <param name="orderRepository">Репозиторій замовлень.</param>
        /// <param name="productRepository">Репозиторій товарів для перевірки наявності та актуальних цін.</param>
        /// <param name="mapper">Екземпляр AutoMapper для проектування моделей.</param>
        public OrderService(IOrderRepository orderRepository, IProductRepository productRepository, IMapper mapper)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
            _mapper = mapper;
        }

        /// <summary>
        /// Створює нове замовлення.
        /// Для кожної знайденої позиції використовує актуальну ціну з каталогу замість ціни, переданої клієнтом.
        /// </summary>
        /// <param name="dto">Вхідні дані замовлення.</param>
        /// <returns>DTO створеного замовлення.</returns>
        public async Task<OrderDto> CreateOrderAsync(CreateOrderDto dto)
        {
            var order = new Order
            {
                CustomerName = dto.CustomerName,
                CustomerEmail = dto.CustomerEmail,
                CustomerPhone = dto.CustomerPhone,
                ShippingAddress = dto.ShippingAddress,
                CreatedAt = DateTime.UtcNow,
                Status = "Pending"
            };

            decimal totalAmount = 0;
            var orderedProducts = new Dictionary<int, Product>();

            foreach (var itemDto in dto.Items)
            {
                if (itemDto.Quantity <= 0) continue;

                if (!orderedProducts.TryGetValue(itemDto.ProductId, out var product))
                {
                    product = await _productRepository.GetByIdAsync(itemDto.ProductId.ToString());
                    if (product == null) continue;
                    orderedProducts[itemDto.ProductId] = product;
                }

                if (product.Variants != null && product.Variants.Count > 0)
                {
                    var variant = product.Variants.FirstOrDefault(v =>
                        string.Equals(v.Color?.Trim(), itemDto.Color?.Trim(), StringComparison.OrdinalIgnoreCase) &&
                        string.Equals(v.Size?.Trim(), itemDto.Size?.Trim(), StringComparison.OrdinalIgnoreCase));

                    if (variant == null || variant.Quantity < itemDto.Quantity)
                    {
                        throw new InvalidOperationException(
                            $"Not enough stock for {product.Name} ({itemDto.Color}, size {itemDto.Size}).");
                    }

                    variant.Quantity -= itemDto.Quantity;
                }

                var orderItem = new OrderItem
                {
                    ProductId = product.Id.ToString(),
                    ProductName = product.Name,
                    Color = itemDto.Color,
                    Size = itemDto.Size,
                    Quantity = itemDto.Quantity,
                    Price = product.Price
                };

                totalAmount += product.Price * itemDto.Quantity;
                order.Items.Add(orderItem);
            }

            order.TotalAmount = totalAmount;
            await _orderRepository.CreateAsync(order);

            foreach (var product in orderedProducts.Values)
            {
                if (product.Variants != null && product.Variants.Count > 0)
                {
                    await _productRepository.UpdateAsync(product);
                }
            }

            return _mapper.Map<OrderDto>(order);
        }

        /// <summary>
        /// Отримує замовлення за його числовим ідентифікатором.
        /// </summary>
        /// <param name="id">Ідентифікатор замовлення.</param>
        /// <returns>Об'єкт <see cref="OrderDto"/> або <c>null</c>.</returns>
        public async Task<OrderDto?> GetOrderByIdAsync(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            return order == null ? null : _mapper.Map<OrderDto>(order);
        }

        /// <summary>
        /// Повертає повний список замовлень.
        /// </summary>
        /// <returns>Перелік усіх замовлень у системі.</returns>
        public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
        {
            var orders = await _orderRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<OrderDto>>(orders);
        }

        /// <summary>
        /// Оновлює поточний статус виконання замовлення за вказаним ID.
        /// </summary>
        /// <param name="id">Ідентифікатор замовлення.</param>
        /// <param name="status">Новий статус.</param>
        public async Task UpdateOrderStatusAsync(int id, string status)
        {
            await _orderRepository.UpdateStatusAsync(id, status);
        }
    }
}