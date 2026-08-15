using CleanArchitecture.Application.Dashboard.Common;
using MediatR;

namespace CleanArchitecture.Application.Dashboard.Queries.GetCarUtilization;

public record GetCarUtilizationQuery(
    DateTime? StartDate,
    DateTime? EndDate) : IRequest<IReadOnlyCollection<CarUtilizationDto>>;
