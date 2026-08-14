using CleanArchitecture.Application.Cars.Common;
using MediatR;

namespace CleanArchitecture.Application.Cars.Commands.AddCarImages;

public record AddCarImagesCommand(int CarId, IReadOnlyList<ImageUploadItem> Images) : IRequest<IReadOnlyCollection<CarImageDto>>;
