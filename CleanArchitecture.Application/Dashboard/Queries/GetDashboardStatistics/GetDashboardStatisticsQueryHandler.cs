using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Dashboard.Common;
using CleanArchitecture.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Dashboard.Queries.GetDashboardStatistics;

public class GetDashboardStatisticsQueryHandler : IRequestHandler<GetDashboardStatisticsQuery, DashboardStatisticsDto>
{
    private readonly IApplicationDbContext _context;

    public GetDashboardStatisticsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatisticsDto> Handle(GetDashboardStatisticsQuery request, CancellationToken cancellationToken)
    {
        var totalCars = await _context.Cars.CountAsync(cancellationToken);

        // A car is "at the lot" unless it's currently out with a renter (PickedUp).
        // Approved-but-not-yet-picked-up reservations don't remove the car from the lot yet.
        var carsCurrentlyOut = _context.Reservations
            .Where(r => r.Status == ReservationStatus.PickedUp)
            .Select(r => r.CarId);

        var availableCars = await _context.Cars
            .CountAsync(c => c.Status == CarStatus.Active && !carsCurrentlyOut.Contains(c.Id), cancellationToken);

        var totalReservations = await _context.Reservations.CountAsync(cancellationToken);

        var pendingReservations = await _context.Reservations
            .CountAsync(r => r.Status == ReservationStatus.Pending, cancellationToken);

        var completedReservations = await _context.Reservations
            .CountAsync(r => r.Status == ReservationStatus.Returned, cancellationToken);

        var totalRevenue = await _context.Payments
            .Where(p => p.Status == PaymentTransactionStatus.Succeeded)
            .SumAsync(p => (decimal?)p.Amount, cancellationToken) ?? 0m;

        return new DashboardStatisticsDto(
            totalCars, availableCars, totalReservations, pendingReservations, completedReservations, totalRevenue);
    }
}
