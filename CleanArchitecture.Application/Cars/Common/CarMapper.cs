using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Application.Cars.Common;

public static class CarMapper
{
    public static CarDetailsDto ToDetailsDto(Car car) => new(
        car.Id,
        car.Name,
        car.Brand,
        car.Model,
        car.Year,
        car.Description,
        car.CarType.ToString(),
        car.FuelType.ToString(),
        car.Transmission.ToString(),
        car.Seats,
        car.PricePerHour,
        car.Location,
        car.Status.ToString(),
        car.CreatedAt,
        car.UpdatedAt,
        car.Images.Select(i => new CarImageDto(i.Id, i.Url, i.IsPrimary)).ToArray());

    public static CarListItemDto ToListItemDto(Car car) => new(
        car.Id,
        car.Name,
        car.Brand,
        car.Model,
        car.Year,
        car.CarType.ToString(),
        car.FuelType.ToString(),
        car.Transmission.ToString(),
        car.Seats,
        car.PricePerHour,
        car.Location,
        car.Status.ToString(),
        car.Images.FirstOrDefault(i => i.IsPrimary)?.Url ?? car.Images.FirstOrDefault()?.Url);
}
