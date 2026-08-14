using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Users.Queries.GetMyProfile;
using MediatR;

namespace CleanArchitecture.Application.Users.Commands.UpdateProfile;

public class UpdateProfileCommandHandler : IRequestHandler<UpdateProfileCommand, UserProfileDto>
{
    private const string ProfileImagesFolder = "godrive/users/profile";
    private const string DocumentsFolder = "godrive/users/documents";

    private readonly IIdentityService _identityService;
    private readonly ICurrentUserService _currentUser;
    private readonly IImageUploadService _imageUploadService;

    public UpdateProfileCommandHandler(
        IIdentityService identityService,
        ICurrentUserService currentUser,
        IImageUploadService imageUploadService)
    {
        _identityService = identityService;
        _currentUser = currentUser;
        _imageUploadService = imageUploadService;
    }

    public async Task<UserProfileDto> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId ?? throw new UnauthorizedAccessException();

        var existing = await _identityService.GetProfileAsync(userId, cancellationToken)
            ?? throw new NotFoundException("User", userId);

        var profileImageUrl = existing.ProfileImageUrl;
        if (request.ProfileImage is not null && request.ProfileImageFileName is not null)
        {
            var uploaded = await _imageUploadService.UploadAsync(
                request.ProfileImage, request.ProfileImageFileName, ProfileImagesFolder, cancellationToken);
            profileImageUrl = uploaded.Url;
        }

        var nidImageUrl = existing.NIDOrPassportImageUrl;
        if (request.NIDOrPassportImage is not null && request.NIDOrPassportImageFileName is not null)
        {
            var uploaded = await _imageUploadService.UploadAsync(
                request.NIDOrPassportImage, request.NIDOrPassportImageFileName, DocumentsFolder, cancellationToken);
            nidImageUrl = uploaded.Url;
        }

        var licenseImageUrl = existing.DrivingLicenseImageUrl;
        if (request.DrivingLicenseImage is not null && request.DrivingLicenseImageFileName is not null)
        {
            var uploaded = await _imageUploadService.UploadAsync(
                request.DrivingLicenseImage, request.DrivingLicenseImageFileName, DocumentsFolder, cancellationToken);
            licenseImageUrl = uploaded.Url;
        }

        await _identityService.UpdateProfileAsync(
            userId,
            request.FullName,
            request.PhoneNumber,
            request.Address,
            profileImageUrl,
            request.NIDOrPassportNumber ?? existing.NIDOrPassportNumber,
            nidImageUrl,
            request.DrivingLicenseNumber ?? existing.DrivingLicenseNumber,
            licenseImageUrl,
            cancellationToken);

        var updated = await _identityService.GetProfileAsync(userId, cancellationToken)
            ?? throw new NotFoundException("User", userId);

        return new UserProfileDto(
            updated.UserId,
            updated.FullName,
            updated.Email,
            updated.PhoneNumber,
            updated.Address,
            updated.ProfileImageUrl,
            updated.NIDOrPassportNumber,
            updated.NIDOrPassportImageUrl,
            updated.DrivingLicenseNumber,
            updated.DrivingLicenseImageUrl,
            updated.Role);
    }
}
