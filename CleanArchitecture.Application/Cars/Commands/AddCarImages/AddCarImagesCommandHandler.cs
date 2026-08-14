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

        var addedImages = new List<CarImage>();

        foreach (var item in request.Images)
        {
            var uploaded = await _imageUploadService.UploadAsync(item.Stream, item.FileName, CarImagesFolder, cancellationToken);
            addedImages.Add(car.AddImage(uploaded.Url, uploaded.PublicId));
        }

        await _context.SaveChangesAsync(cancellationToken);

        return addedImages.Select(i => new CarImageDto(i.Id, i.Url, i.IsPrimary)).ToArray();
    }
}
