using CleanArchitecture.Application.Cars.Common;
using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Cars.Commands.UpdateCar;

public class UpdateCarCommandHandler : IRequestHandler<UpdateCarCommand, CarDetailsDto>
{
    private readonly IApplicationDbContext _context;

    public UpdateCarCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CarDetailsDto> Handle(UpdateCarCommand request, CancellationToken cancellationToken)
    {
        var car = await _context.Cars
            .Include(c => c.Images)
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException("Car", request.Id);

        car.Name = request.Name;
        car.Brand = request.Brand;
        car.Model = request.Model;
        car.Year = request.Year;
        car.Description = request.Description;
        car.CarType = request.CarType;
        car.FuelType = request.FuelType;
        car.Transmission = request.Transmission;
        car.Seats = request.Seats;
        car.PricePerHour = request.PricePerHour;
        car.Location = request.Location;
        car.Status = request.Status;
        car.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return CarMapper.ToDetailsDto(car);
    }
}
