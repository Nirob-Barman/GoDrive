using CleanArchitecture.Application.Cars.Common;
using CleanArchitecture.Application.Common.Models;
using CleanArchitecture.Domain.Enums;
using MediatR;

namespace CleanArchitecture.Application.Cars.Queries.GetCars;

public record GetCarsQuery(
    string? Search,
    CarType? CarType,
    FuelType? FuelType,
    TransmissionType? Transmission,
    decimal? MinPrice,
    decimal? MaxPrice,
    string? Location,
    int PageNumber = 1,
    int PageSize = 12) : IRequest<PaginatedList<CarListItemDto>>;
