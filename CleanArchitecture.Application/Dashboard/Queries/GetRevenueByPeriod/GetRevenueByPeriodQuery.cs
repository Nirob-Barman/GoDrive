using CleanArchitecture.Application.Dashboard.Common;
using MediatR;

namespace CleanArchitecture.Application.Dashboard.Queries.GetRevenueByPeriod;

public record GetRevenueByPeriodQuery(
    RevenuePeriod Period,
    DateTime? StartDate,
    DateTime? EndDate) : IRequest<IReadOnlyCollection<RevenueDataPointDto>>;
