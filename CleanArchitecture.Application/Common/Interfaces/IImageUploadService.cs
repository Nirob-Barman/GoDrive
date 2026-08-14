using CleanArchitecture.Application.Common.Models;

namespace CleanArchitecture.Application.Common.Interfaces;

public interface IImageUploadService
{
    Task<UploadedImage> UploadAsync(Stream fileStream, string fileName, string folder, CancellationToken cancellationToken);

    Task DeleteAsync(string publicId, CancellationToken cancellationToken);
}
