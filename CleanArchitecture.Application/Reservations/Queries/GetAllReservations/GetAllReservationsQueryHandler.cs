using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Models;
using CleanArchitecture.Application.Reservations.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Reservations.Queries.GetAllReservations;

public class GetAllReservationsQueryHandler : IRequestHandler<GetAllReservationsQuery, PaginatedList<ReservationDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllReservationsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<ReservationDto>> Handle(GetAllReservationsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Reservations.Include(r => r.Car).AsQueryable();

        if (request.Status is not null)
        {
            query = query.Where(r => r.Status == request.Status);
        }

        query = query.OrderByDescending(r => r.CreatedAtUtc);

        var paged = await PaginatedList<Domain.Entities.Reservation>.CreateAsync(
            query, request.PageNumber, request.PageSize, cancellationToken);

        return new PaginatedList<ReservationDto>(
            paged.Items.Select(ReservationMapper.ToDto).ToArray(),
            paged.TotalCount,
            paged.PageNumber,
            request.PageSize);
    }
}
