using CleanArchitecture.Application.Dashboard.Common;
using MediatR;

namespace CleanArchitecture.Application.Dashboard.Queries.GetDashboardStatistics;

public record GetDashboardStatisticsQuery : IRequest<DashboardStatisticsDto>;
