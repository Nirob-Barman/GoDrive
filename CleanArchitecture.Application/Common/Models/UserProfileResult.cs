namespace CleanArchitecture.Application.Common.Models;

public record UserProfileResult(
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
    bool IsActive,
    string Role);
