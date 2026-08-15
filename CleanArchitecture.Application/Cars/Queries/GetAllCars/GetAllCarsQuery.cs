using CleanArchitecture.Application.Cars.Common;
using CleanArchitecture.Application.Common.Models;
using CleanArchitecture.Domain.Enums;
using MediatR;

namespace CleanArchitecture.Application.Cars.Queries.GetAllCars;

// Admin-scoped counterpart to GetCarsQuery - that one hard-filters to Status == Active
// (it's the public listing), so admins need this to find/manage Inactive or Maintenance cars.
public record GetAllCarsQuery(
    string? Search,
    CarType? CarType,
    FuelType? FuelType,
    TransmissionType? Transmission,
    CarStatus? Status,
    decimal? MinPrice,
    decimal? MaxPrice,
    string? Location,
    int PageNumber = 1,
    int PageSize = 20) : IRequest<PaginatedList<CarListItemDto>>;
