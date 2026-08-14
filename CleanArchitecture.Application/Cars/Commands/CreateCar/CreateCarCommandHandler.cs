using CleanArchitecture.Application.Cars.Common;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Domain.Entities;
using MediatR;

namespace CleanArchitecture.Application.Cars.Commands.CreateCar;

public class CreateCarCommandHandler : IRequestHandler<CreateCarCommand, CarDetailsDto>
{
    private readonly IApplicationDbContext _context;

    public CreateCarCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CarDetailsDto> Handle(CreateCarCommand request, CancellationToken cancellationToken)
    {
        var car = Car.Create(
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
            request.Location);

        _context.Cars.Add(car);
        await _context.SaveChangesAsync(cancellationToken);

        return CarMapper.ToDetailsDto(car);
    }
}
