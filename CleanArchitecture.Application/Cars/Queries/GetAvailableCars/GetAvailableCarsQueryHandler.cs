using CleanArchitecture.Application.Cars.Common;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Models;
using CleanArchitecture.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Cars.Queries.GetAvailableCars;

// NOTE: overlap-exclusion against active reservations lands in Phase 4 once the Reservation
// entity exists. For now this returns all Active cars matching the filters (dates are
// validated but not yet used to exclude overlapping bookings).
public class GetAvailableCarsQueryHandler : IRequestHandler<GetAvailableCarsQuery, PaginatedList<CarListItemDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAvailableCarsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<CarListItemDto>> Handle(GetAvailableCarsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Cars
            .Include(c => c.Images)
            .Where(c => c.Status == CarStatus.Active)
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
