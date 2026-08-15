using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Dashboard.Common;
using CleanArchitecture.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Dashboard.Queries.GetCarUtilization;

public class GetCarUtilizationQueryHandler
    : IRequestHandler<GetCarUtilizationQuery, IReadOnlyCollection<CarUtilizationDto>>
{
    // A reservation reserves the car's time as soon as it's Approved, even before pickup —
    // Pending/Rejected/Cancelled never actually occupied the car, so they don't count as usage.
    private static readonly ReservationStatus[] ConfirmedStatuses =
    {
        ReservationStatus.Approved, ReservationStatus.PickedUp, ReservationStatus.Returned
    };

    private readonly IApplicationDbContext _context;

    public GetCarUtilizationQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyCollection<CarUtilizationDto>> Handle(
        GetCarUtilizationQuery request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var startDate = request.StartDate ?? now.AddDays(-30);
        var endDate = request.EndDate ?? now;
        var periodHours = Math.Max((endDate - startDate).TotalHours, 1);

        var reservationStats = await _context.Reservations
            .Where(r => ConfirmedStatuses.Contains(r.Status) && r.PickupDate >= startDate && r.PickupDate <= endDate)
            .GroupBy(r => r.CarId)
            .Select(g => new { CarId = g.Key, Bookings = g.Count(), BookedHours = g.Sum(r => r.TotalHours) })
            .ToListAsync(cancellationToken);

        var cars = await _context.Cars
            .Select(c => new { c.Id, c.Name })
            .ToListAsync(cancellationToken);

        var statsByCarId = reservationStats.ToDictionary(s => s.CarId);

        return cars
            .Select(c =>
            {
                statsByCarId.TryGetValue(c.Id, out var stats);
                var bookedHours = stats?.BookedHours ?? 0;
                var utilizationRate = Math.Round((decimal)(bookedHours / periodHours * 100), 2);
                return new CarUtilizationDto(c.Id, c.Name, stats?.Bookings ?? 0, bookedHours, utilizationRate);
            })
            .OrderByDescending(x => x.UtilizationRatePercent)
            .ToArray();
    }
}
