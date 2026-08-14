using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Models;
using MediatR;

namespace CleanArchitecture.Application.Users.Queries.GetUsers;

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, PaginatedList<UserSummaryDto>>
{
    private readonly IIdentityService _identityService;

    public GetUsersQueryHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<PaginatedList<UserSummaryDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var result = await _identityService.GetUsersAsync(
            request.Search, request.IsActive, request.PageNumber, request.PageSize, cancellationToken);

        return new PaginatedList<UserSummaryDto>(
            result.Items.Select(u => new UserSummaryDto(u.UserId, u.FullName, u.Email, u.PhoneNumber, u.IsActive, u.Role)).ToArray(),
            result.TotalCount,
            result.PageNumber,
            request.PageSize);
    }
}
