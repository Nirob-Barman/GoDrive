namespace CleanArchitecture.Application.Cars.Common;

public record CarDetailsDto(
    int Id,
    string Name,
    string Brand,
    string Model,
    int Year,
    string? Description,
    string CarType,
    string FuelType,
    string Transmission,
    int Seats,
    decimal PricePerHour,
    string Location,
    string Status,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    IReadOnlyCollection<CarImageDto> Images,
    decimal? AverageRating,
    int ReviewCount);
