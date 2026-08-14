using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Cars.Commands.DeleteCar;

public class DeleteCarCommandHandler : IRequestHandler<DeleteCarCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IImageUploadService _imageUploadService;

    public DeleteCarCommandHandler(IApplicationDbContext context, IImageUploadService imageUploadService)
    {
        _context = context;
        _imageUploadService = imageUploadService;
    }

    public async Task Handle(DeleteCarCommand request, CancellationToken cancellationToken)
    {
        var car = await _context.Cars
            .Include(c => c.Images)
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException("Car", request.Id);

        var hasReservations = await _context.Reservations.AnyAsync(r => r.CarId == request.Id, cancellationToken);
        if (hasReservations)
        {
            throw new ConflictException("This car has reservation history and cannot be deleted. Deactivate it instead.");
        }

        foreach (var image in car.Images)
        {
            await _imageUploadService.DeleteAsync(image.PublicId, cancellationToken);
        }

        _context.Cars.Remove(car);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
