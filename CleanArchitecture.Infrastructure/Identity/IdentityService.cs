using CleanArchitecture.Application.Common.Constants;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public IdentityService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<bool> IsEmailInUseAsync(string email, CancellationToken cancellationToken)
    {
        var normalizedEmail = email.ToUpperInvariant();
        return await _userManager.Users.AnyAsync(u => u.NormalizedEmail == normalizedEmail, cancellationToken);
    }

    public async Task<CreateUserResult> CreateUserAsync(
        string fullName, string email, string password, string? phoneNumber, CancellationToken cancellationToken)
    {
        var user = ApplicationUser.Create(email, fullName, phoneNumber);

        var result = await _userManager.CreateAsync(user, password);

        if (!result.Succeeded)
        {
            return new CreateUserResult(false, null, result.Errors.Select(e => e.Description).ToArray());
        }

        await _userManager.AddToRoleAsync(user, Roles.User);

        return new CreateUserResult(true, user.Id, Array.Empty<string>());
    }

    public async Task<AuthenticateResult> AuthenticateAsync(string email, string password, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user is null)
        {
            return new AuthenticateResult(false, null, null, null, null, "Invalid email or password.");
        }

        if (await _userManager.IsLockedOutAsync(user))
        {
            return new AuthenticateResult(false, null, null, null, null, "Account locked due to repeated failed login attempts. Try again later.");
        }

        if (!await _userManager.CheckPasswordAsync(user, password))
        {
            await _userManager.AccessFailedAsync(user);
            return new AuthenticateResult(false, null, null, null, null, "Invalid email or password.");
        }

        await _userManager.ResetAccessFailedCountAsync(user);

        if (!user.IsActive)
        {
            return new AuthenticateResult(false, null, null, null, null, "This account has been disabled.");
        }

        var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault() ?? Roles.User;

        return new AuthenticateResult(true, user.Id, user.Email, user.FullName, role, null);
    }

    public async Task<UserProfileResult?> GetProfileAsync(string userId, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user is null)
        {
            return null;
        }

        var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault() ?? Roles.User;

        return new UserProfileResult(
            user.Id,
            user.FullName,
            user.Email ?? string.Empty,
            user.PhoneNumber,
            user.Address,
            user.ProfileImageUrl,
            user.NIDOrPassportNumber,
            user.NIDOrPassportImageUrl,
            user.DrivingLicenseNumber,
            user.DrivingLicenseImageUrl,
            user.IsActive,
            role);
    }

    public async Task<bool> UpdateProfileAsync(
        string userId,
        string fullName,
        string? phoneNumber,
        string? address,
        string? profileImageUrl,
        string? nidOrPassportNumber,
        string? nidOrPassportImageUrl,
        string? drivingLicenseNumber,
        string? drivingLicenseImageUrl,
        CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user is null)
        {
            return false;
        }

        user.UpdateProfile(
            fullName, phoneNumber, address, profileImageUrl,
            nidOrPassportNumber, nidOrPassportImageUrl, drivingLicenseNumber, drivingLicenseImageUrl);

        var result = await _userManager.UpdateAsync(user);

        return result.Succeeded;
    }

    public async Task<ChangePasswordResult> ChangePasswordAsync(
        string userId, string currentPassword, string newPassword, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user is null)
        {
            return new ChangePasswordResult(false, new[] { "User not found." });
        }

        var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);

        return new ChangePasswordResult(result.Succeeded, result.Errors.Select(e => e.Description).ToArray());
    }

    public async Task<PasswordResetTokenResult?> GeneratePasswordResetTokenAsync(string email, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user is null)
        {
            return null;
        }

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);

        return new PasswordResetTokenResult(token, user.Email ?? email, user.FullName);
    }

    public async Task<ResetPasswordResult> ResetPasswordAsync(
        string email, string token, string newPassword, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user is null)
        {
            return new ResetPasswordResult(false, null, new[] { "Invalid token." });
        }

        var result = await _userManager.ResetPasswordAsync(user, token, newPassword);

        return new ResetPasswordResult(result.Succeeded, user.Id, result.Errors.Select(e => e.Description).ToArray());
    }
}
