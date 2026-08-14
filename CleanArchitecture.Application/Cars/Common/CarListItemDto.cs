namespace CleanArchitecture.Application.Cars.Common;

public record CarListItemDto(
    int Id,
    string Name,
    string Brand,
    string Model,
    int Year,
    string CarType,
    string FuelType,
    string Transmission,
    int Seats,
    decimal PricePerHour,
    string Location,
    string Status,
    string? PrimaryImageUrl);
