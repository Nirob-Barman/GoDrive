using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Dashboard.Common;
using CleanArchitecture.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Dashboard.Queries.GetRevenueByPeriod;

public class GetRevenueByPeriodQueryHandler : IRequestHandler<GetRevenueByPeriodQuery, IReadOnlyCollection<RevenueDataPointDto>>
{
    private readonly IApplicationDbContext _context;

    public GetRevenueByPeriodQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyCollection<RevenueDataPointDto>> Handle(
        GetRevenueByPeriodQuery request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;

        var startDate = request.StartDate ?? request.Period switch
        {
            RevenuePeriod.Daily => now.AddDays(-30),
            RevenuePeriod.Weekly => now.AddDays(-7 * 12),
            RevenuePeriod.Monthly => now.AddMonths(-12),
            RevenuePeriod.Yearly => now.AddYears(-5),
            _ => now.AddDays(-30)
        };

        var endDate = request.EndDate ?? now;

        var payments = await _context.Payments
            .Where(p => p.Status == PaymentTransactionStatus.Succeeded
                && p.PaidAtUtc != null
                && p.PaidAtUtc >= startDate
                && p.PaidAtUtc <= endDate)
            .Select(p => new { p.PaidAtUtc, p.Amount })
            .ToListAsync(cancellationToken);

        return payments
            .GroupBy(p => GetPeriodStart(p.PaidAtUtc!.Value, request.Period))
            .Select(g => new RevenueDataPointDto(g.Key, g.Sum(x => x.Amount)))
            .OrderBy(x => x.PeriodStart)
            .ToArray();
    }

    private static DateTime GetPeriodStart(DateTime date, RevenuePeriod period) => period switch
    {
        RevenuePeriod.Daily => date.Date,
        RevenuePeriod.Weekly => date.Date.AddDays(-(int)date.DayOfWeek),
        RevenuePeriod.Monthly => new DateTime(date.Year, date.Month, 1),
        RevenuePeriod.Yearly => new DateTime(date.Year, 1, 1),
        _ => date.Date
    };
}
