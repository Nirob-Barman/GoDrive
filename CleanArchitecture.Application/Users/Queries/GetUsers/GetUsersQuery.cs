using CleanArchitecture.Application.Common.Models;
using MediatR;

namespace CleanArchitecture.Application.Users.Queries.GetUsers;

public record GetUsersQuery(
    string? Search,
    bool? IsActive,
    int PageNumber = 1,
    int PageSize = 20) : IRequest<PaginatedList<UserSummaryDto>>;
