using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using MediatR;

namespace CleanArchitecture.Application.Users.Queries.GetMyProfile;

public class GetMyProfileQueryHandler : IRequestHandler<GetMyProfileQuery, UserProfileDto>
{
    private readonly IIdentityService _identityService;
    private readonly ICurrentUserService _currentUser;

    public GetMyProfileQueryHandler(IIdentityService identityService, ICurrentUserService currentUser)
    {
        _identityService = identityService;
        _currentUser = currentUser;
    }

    public async Task<UserProfileDto> Handle(GetMyProfileQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId ?? throw new UnauthorizedAccessException();

        var profile = await _identityService.GetProfileAsync(userId, cancellationToken)
            ?? throw new NotFoundException("User", userId);

        return new UserProfileDto(
            profile.UserId,
            profile.FullName,
            profile.Email,
            profile.PhoneNumber,
            profile.Address,
            profile.ProfileImageUrl,
            profile.NIDOrPassportNumber,
            profile.NIDOrPassportImageUrl,
            profile.DrivingLicenseNumber,
            profile.DrivingLicenseImageUrl,
            profile.Role);
    }
}
