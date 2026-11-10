using System.Diagnostics.CodeAnalysis;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using NewBalanceStore.Domain.Interfaces;
using NewBalanceStore.Infrastructure.Configurations;

namespace NewBalanceStore.Infrastructure.Services;

/// <summary>
/// Реалізація сервісу збереження та оптимізації медіафайлів за допомогою хмарного провайдера Cloudinary.
/// </summary>
[ExcludeFromCodeCoverage]
public class PhotoService : IPhotoService
{
    private readonly Cloudinary _cloudinary;

    /// <summary>
    /// Ініціалізує сервіс фотографій, конфігуруючи клієнт Cloudinary обліковими записами із <see cref="CloudinarySettings"/>.
    /// </summary>
    /// <param name="config">Налаштування Cloudinary (CloudName, ApiKey, ApiSecret).</param>
    public PhotoService(IOptions<CloudinarySettings> config)
    {
        var acc = new Account(
            config.Value.CloudName,
            config.Value.ApiKey,
            config.Value.ApiSecret
        );

        _cloudinary = new Cloudinary(acc);
    }

    /// <summary>
    /// Завантажує зображення у хмару Cloudinary із автоматичною обрізкою та масштабуванням (500x500 fill face).
    /// </summary>
    /// <param name="fileStream">Потік вхідного графічного файлу.</param>
    /// <param name="fileName">Ім'я завантажуваного файлу.</param>
    /// <returns>Захищене HTTPS-посилання (SecureUrl) на розміщене зображення.</returns>
    /// <exception cref="Exception">Виникає у разі отримання помилки від API Cloudinary.</exception>
    public async Task<string> AddPhotoAsync(Stream fileStream, string fileName)
    {
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(fileName, fileStream),
            Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        if (uploadResult.Error != null)
        {
            throw new Exception(uploadResult.Error.Message);
        }

        return uploadResult.SecureUrl?.ToString() ?? string.Empty;
    }
}
