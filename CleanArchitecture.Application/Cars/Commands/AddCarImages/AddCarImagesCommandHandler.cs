using CleanArchitecture.Application.Cars.Common;
using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Cars.Commands.AddCarImages;

public class AddCarImagesCommandHandler : IRequestHandler<AddCarImagesCommand, IReadOnlyCollection<CarImageDto>>
{
    private const string CarImagesFolder = "godrive/cars";

    private readonly IApplicationDbContext _context;
    private readonly IImageUploadService _imageUploadService;

    public AddCarImagesCommandHandler(IApplicationDbContext context, IImageUploadService imageUploadService)
    {
        _context = context;
        _imageUploadService = imageUploadService;
    }

    public async Task<IReadOnlyCollection<CarImageDto>> Handle(AddCarImagesCommand request, CancellationToken cancellationToken)
    {
        var car = await _context.Cars
            .Include(c => c.Images)
            .FirstOrDefaultAsync(c => c.Id == request.CarId, cancellationToken)
            ?? throw new NotFoundException("Car", request.CarId);

        var hasPrimaryAlready = car.Images.Any(i => i.IsPrimary);

        foreach (var item in request.Images)
        {
            var uploaded = await _imageUploadService.UploadAsync(item.Stream, item.FileName, CarImagesFolder, cancellationToken);

            car.Images.Add(new CarImage
            {
                CarId = car.Id,
                Url = uploaded.Url,
                PublicId = uploaded.PublicId,
                IsPrimary = !hasPrimaryAlready,
                CreatedAt = DateTime.UtcNow
            });

            hasPrimaryAlready = true;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return car.Images.Select(i => new CarImageDto(i.Id, i.Url, i.IsPrimary)).ToArray();
    }
}
