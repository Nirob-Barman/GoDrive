using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Enums;

namespace CleanArchitecture.Application.Cars.Common;

public static class CarQueryFilters
{
    public static IQueryable<Car> Apply(
        IQueryable<Car> query,
        string? search,
        CarType? carType,
        FuelType? fuelType,
        TransmissionType? transmission,
        decimal? minPrice,
        decimal? maxPrice,
        string? location)
    {
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(c => c.Name.Contains(term) || c.Brand.Contains(term) || c.Model.Contains(term));
        }

        if (carType is not null)
        {
            query = query.Where(c => c.CarType == carType);
        }

        if (fuelType is not null)
        {
            query = query.Where(c => c.FuelType == fuelType);
        }

        if (transmission is not null)
        {
            query = query.Where(c => c.Transmission == transmission);
        }

        if (minPrice is not null)
        {
            query = query.Where(c => c.PricePerHour >= minPrice);
        }

        if (maxPrice is not null)
        {
            query = query.Where(c => c.PricePerHour <= maxPrice);
        }

        if (!string.IsNullOrWhiteSpace(location))
        {
            query = query.Where(c => c.Location.Contains(location));
        }

        return query;
    }
}
