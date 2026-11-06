using NewBalanceStore.Domain.Entities;

namespace NewBalanceStore.Domain.Interfaces;

/// <summary>
/// Контракт репозиторію для доступу до сутностей облікових записів користувачів.
/// </summary>
public interface IUserRepository
{
    /// <summary>
    /// Знаходить користувача за адресою електронної пошти без урахування регістру.
    /// </summary>
    /// <param name="email">Email адреса для пошуку.</param>
    /// <returns>Екземпляр <see cref="User"/> або <c>null</c>, якщо користувача не знайдено.</returns>
    Task<User?> GetByEmailAsync(string email);

    /// <summary>
    /// Зберігає нового зареєстрованого користувача у базі даних.
    /// </summary>
    /// <param name="user">Об'єкт користувача з хешованим паролем та роллю.</param>
    Task CreateAsync(User user);

    /// <summary>
    /// Асинхронно обновляет данные пользователя.
    /// </summary>
    /// <param name="user">Пользователь для обновления.</param>
    /// <returns>Задача, представляющая асинхронную операцию обновления.</returns>
    Task UpdateAsync(User user);

    /// <summary>
    /// Отримує перелік усіх користувачів системи.
    /// </summary>
    /// <returns>Колекція сутностей <see cref="User"/>.</returns>
    Task<IEnumerable<User>> GetAllAsync();
}