using CleanArchitecture.Application.Cars.Common;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Models;
using CleanArchitecture.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Cars.Queries.GetAvailableCars;

public class GetAvailableCarsQueryHandler : IRequestHandler<GetAvailableCarsQuery, PaginatedList<CarListItemDto>>
{
    private static readonly ReservationStatus[] BlockingStatuses =
    {
        ReservationStatus.Pending, ReservationStatus.Approved, ReservationStatus.PickedUp
    };

    private readonly IApplicationDbContext _context;

    public GetAvailableCarsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<CarListItemDto>> Handle(GetAvailableCarsQuery request, CancellationToken cancellationToken)
    {
        var overlappingCarIds = _context.Reservations
            .Where(r => BlockingStatuses.Contains(r.Status)
                && r.PickupDate < request.DropoffDate
                && request.PickupDate < r.DropoffDate)
            .Select(r => r.CarId);

        var query = _context.Cars
            .Include(c => c.Images)
            .Where(c => c.Status == CarStatus.Active && !overlappingCarIds.Contains(c.Id))
            .AsQueryable();

        query = CarQueryFilters.Apply(
            query, request.Search, request.CarType, request.FuelType, request.Transmission,
            request.MinPrice, request.MaxPrice, request.Location);

        query = query.OrderBy(c => c.Name);

        var paged = await PaginatedList<Domain.Entities.Car>.CreateAsync(
            query, request.PageNumber, request.PageSize, cancellationToken);

        return new PaginatedList<CarListItemDto>(
            paged.Items.Select(CarMapper.ToListItemDto).ToArray(),
            paged.TotalCount,
            paged.PageNumber,
            request.PageSize);
    }
}
