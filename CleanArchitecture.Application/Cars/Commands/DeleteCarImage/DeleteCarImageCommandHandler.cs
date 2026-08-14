using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Cars.Commands.DeleteCarImage;

public class DeleteCarImageCommandHandler : IRequestHandler<DeleteCarImageCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IImageUploadService _imageUploadService;

    public DeleteCarImageCommandHandler(IApplicationDbContext context, IImageUploadService imageUploadService)
    {
        _context = context;
        _imageUploadService = imageUploadService;
    }

    public async Task Handle(DeleteCarImageCommand request, CancellationToken cancellationToken)
    {
        var car = await _context.Cars
            .Include(c => c.Images)
            .FirstOrDefaultAsync(c => c.Id == request.CarId, cancellationToken)
            ?? throw new NotFoundException("Car", request.CarId);

        var image = car.Images.FirstOrDefault(i => i.Id == request.ImageId)
            ?? throw new NotFoundException("CarImage", request.ImageId);

        await _imageUploadService.DeleteAsync(image.PublicId, cancellationToken);

        car.RemoveImage(image.Id);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
