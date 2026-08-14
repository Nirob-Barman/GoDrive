using CleanArchitecture.Application.Common.Models;

namespace CleanArchitecture.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<bool> IsEmailInUseAsync(string email, CancellationToken cancellationToken);

    Task<CreateUserResult> CreateUserAsync(
        string fullName,
        string email,
        string password,
        string? phoneNumber,
        CancellationToken cancellationToken);

    Task<AuthenticateResult> AuthenticateAsync(string email, string password, CancellationToken cancellationToken);

    Task<UserProfileResult?> GetProfileAsync(string userId, CancellationToken cancellationToken);

    Task<bool> UpdateProfileAsync(
        string userId,
        string fullName,
        string? phoneNumber,
        string? address,
        string? profileImageUrl,
        string? nidOrPassportNumber,
        string? nidOrPassportImageUrl,
        string? drivingLicenseNumber,
        string? drivingLicenseImageUrl,
        CancellationToken cancellationToken);

    Task<ChangePasswordResult> ChangePasswordAsync(
        string userId, string currentPassword, string newPassword, CancellationToken cancellationToken);

    Task<PasswordResetTokenResult?> GeneratePasswordResetTokenAsync(string email, CancellationToken cancellationToken);

    Task<ResetPasswordResult> ResetPasswordAsync(
        string email, string token, string newPassword, CancellationToken cancellationToken);

    Task<PaginatedList<UserSummaryResult>> GetUsersAsync(
        string? search, bool? isActive, int pageNumber, int pageSize, CancellationToken cancellationToken);

    Task<bool> SetUserActiveStatusAsync(string userId, bool isActive, CancellationToken cancellationToken);

    Task<bool> ChangeUserRoleAsync(string userId, string newRole, CancellationToken cancellationToken);
}
