using CleanArchitecture.Application.Cars.Common;
using CleanArchitecture.Domain.Enums;
using MediatR;

namespace CleanArchitecture.Application.Cars.Commands.UpdateCar;

public record UpdateCarCommand(
    int Id,
    string Name,
    string Brand,
    string Model,
    int Year,
    string? Description,
    CarType CarType,
    FuelType FuelType,
    TransmissionType Transmission,
    int Seats,
    decimal PricePerHour,
    string Location,
    CarStatus Status) : IRequest<CarDetailsDto>;
