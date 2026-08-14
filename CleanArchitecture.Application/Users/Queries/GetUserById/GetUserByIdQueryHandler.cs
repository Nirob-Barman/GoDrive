using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Users.Queries.GetMyProfile;
using MediatR;

namespace CleanArchitecture.Application.Users.Queries.GetUserById;

public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserProfileDto>
{
    private readonly IIdentityService _identityService;

    public GetUserByIdQueryHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<UserProfileDto> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var profile = await _identityService.GetProfileAsync(request.UserId, cancellationToken)
            ?? throw new NotFoundException("User", request.UserId);

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
