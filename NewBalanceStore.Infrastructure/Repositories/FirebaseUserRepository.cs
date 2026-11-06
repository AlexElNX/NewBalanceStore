using System.Diagnostics.CodeAnalysis;
using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.Extensions.Configuration;
using NewBalanceStore.Domain.Entities;
using NewBalanceStore.Domain.Interfaces;
using Newtonsoft.Json.Linq;

namespace NewBalanceStore.Infrastructure.Repositories;

/// <summary>
/// Репозиторій для роботи з користувачами в Firebase Realtime Database.
/// Забезпечує пошук та збереження профілів у вузлі <c>users</c>.
/// </summary>
[ExcludeFromCodeCoverage]
public class FirebaseUserRepository : IUserRepository
{
    private readonly FirebaseClient _firebaseClient;
    private const string CollectionName = "users";

    /// <summary>
    /// Ініціалізує репозиторій користувачів, зчитуючи адресу бази даних із конфігурації.
    /// </summary>
    /// <param name="config">Конфігурація застосунку.</param>
    /// <exception cref="InvalidOperationException">Якщо параметр Firebase:DatabaseUrl не налаштовано.</exception>
    public FirebaseUserRepository(IConfiguration config)
    {
        var databaseUrl = config["Firebase:DatabaseUrl"]
            ?? throw new InvalidOperationException("Firebase:DatabaseUrl не настроено в appsettings.json");

        _firebaseClient = new FirebaseClient(databaseUrl);
    }

    /// <summary>
    /// Знаходить користувача за адресою електронної пошти (без урахування регістру символів).
    /// </summary>
    /// <param name="email">Email адреса шуканого акаунта.</param>
    /// <returns>Екземпляр <see cref="User"/> або <c>null</c>, якщо запис відсутній.</returns>
    public async Task<User?> GetByEmailAsync(string email)
    {
        var users = await GetAllAsync();
        return users.FirstOrDefault(u => u.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
    }

    /// <summary>
    /// Створює новий запис користувача. Якщо ID користувача порожній, генерує новий GUID.
    /// </summary>
    /// <param name="user">Об'єкт користувача з хешованим паролем.</param>
    public async Task CreateAsync(User user)
    {
        if (string.IsNullOrEmpty(user.Id))
        {
            user.Id = Guid.NewGuid().ToString();
        }

        await _firebaseClient
            .Child($"{CollectionName}/{user.Id}")
            .PutAsync(user);
    }
    /// <summary>
    /// Оновлює дані існуючого користувача (наприклад, при збереженні Refresh Token).
    /// </summary>
    /// <param name="user">Об'єкт користувача з оновленими полями.</param>
    public async Task UpdateAsync(User user)
    {
        if (string.IsNullOrEmpty(user.Id))
        {
            throw new ArgumentException("ID користувача не може бути порожнім.");
        }

        await _firebaseClient
            .Child($"{CollectionName}/{user.Id}")
            .PutAsync(user);
    }

    /// <summary>
    /// Отримує всіх користувачів із бази даних.
    /// </summary>
    /// <returns>Список доменних сутностей <see cref="User"/>.</returns>
    public async Task<IEnumerable<User>> GetAllAsync()
    {
        var objects = await _firebaseClient
            .Child(CollectionName)
            .OnceAsync<JObject>();

        var usersList = new List<User>();

        foreach (var item in objects)
        {
            try
            {
                var user = item.Object?.ToObject<User>();
                if (user != null)
                {
                    if (string.IsNullOrEmpty(user.Id))
                    {
                        user.Id = item.Key;
                    }
                    usersList.Add(user);
                }
            }
            catch
            {
                continue;
            }
        }

        return usersList;
    }
}