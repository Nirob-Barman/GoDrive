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

        car.UpdateDetails(
            request.Name,
            request.Brand,
            request.Model,
            request.Year,
            request.Description,
            request.CarType,
            request.FuelType,
            request.Transmission,
            request.Seats,
            request.PricePerHour,
            request.Location,
            request.Status);

        await _context.SaveChangesAsync(cancellationToken);

        return CarMapper.ToDetailsDto(car);
    }
}
