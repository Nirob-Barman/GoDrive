namespace CleanArchitecture.Application.Users.Queries.GetMyProfile;

public record UserProfileDto(
    string UserId,
    string FullName,
    string Email,
    string? PhoneNumber,
    string? Address,
    string? ProfileImageUrl,
    string? NIDOrPassportNumber,
    string? NIDOrPassportImageUrl,
    string? DrivingLicenseNumber,
    string? DrivingLicenseImageUrl,
    string Role);
