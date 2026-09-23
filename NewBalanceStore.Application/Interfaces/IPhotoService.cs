using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace NewBalanceStore.Application.Interfaces;

public interface IPhotoService
{
    Task<ImageUploadResult> AddPhotoAsync(IFormFile file);
}