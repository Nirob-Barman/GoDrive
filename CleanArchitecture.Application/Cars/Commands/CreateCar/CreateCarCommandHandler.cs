using CleanArchitecture.Application.Cars.Common;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Enums;
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
        var car = new Car
        {
            Name = request.Name,
            Brand = request.Brand,
            Model = request.Model,
            Year = request.Year,
            Description = request.Description,
            CarType = request.CarType,
            FuelType = request.FuelType,
            Transmission = request.Transmission,
            Seats = request.Seats,
            PricePerHour = request.PricePerHour,
            Location = request.Location,
            Status = CarStatus.Active,
            CreatedAt = DateTime.UtcNow
        };

        _context.Cars.Add(car);
        await _context.SaveChangesAsync(cancellationToken);

        return CarMapper.ToDetailsDto(car);
    }
}
