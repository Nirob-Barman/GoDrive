using CleanArchitecture.Application.Users.Queries.GetMyProfile;
using MediatR;

namespace CleanArchitecture.Application.Users.Commands.UpdateProfile;

public record UpdateProfileCommand(
    string FullName,
    string? PhoneNumber,
    string? Address,
    string? NIDOrPassportNumber,
    string? DrivingLicenseNumber,
    Stream? ProfileImage,
    string? ProfileImageFileName,
    Stream? NIDOrPassportImage,
    string? NIDOrPassportImageFileName,
    Stream? DrivingLicenseImage,
    string? DrivingLicenseImageFileName) : IRequest<UserProfileDto>;
