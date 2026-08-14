using Microsoft.AspNetCore.Identity;

namespace CleanArchitecture.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{
    // Base IdentityUser properties (UserName, Email, PhoneNumber, ...) stay public - UserManager/UserStore
    // assign them directly. Only our own additions are encapsulated below.
    public string FullName { get; private set; } = string.Empty;
    public string? Address { get; private set; }
    public string? ProfileImageUrl { get; private set; }
    public string? NIDOrPassportNumber { get; private set; }
    public string? NIDOrPassportImageUrl { get; private set; }
    public string? DrivingLicenseNumber { get; private set; }
    public string? DrivingLicenseImageUrl { get; private set; }
    public bool IsActive { get; private set; } = true;

    // Identity requires a public parameterless constructor (Activator.CreateInstance in some code paths).
    public ApplicationUser()
    {
    }

    public static ApplicationUser Create(string email, string fullName, string? phoneNumber)
    {
        return new ApplicationUser
        {
            UserName = email,
            Email = email,
            FullName = fullName,
            PhoneNumber = phoneNumber,
            IsActive = true
        };
    }

    public void UpdateProfile(
        string fullName,
        string? phoneNumber,
        string? address,
        string? profileImageUrl,
        string? nidOrPassportNumber,
        string? nidOrPassportImageUrl,
        string? drivingLicenseNumber,
        string? drivingLicenseImageUrl)
    {
        FullName = fullName;
        PhoneNumber = phoneNumber;
        Address = address;
        ProfileImageUrl = profileImageUrl;
        NIDOrPassportNumber = nidOrPassportNumber;
        NIDOrPassportImageUrl = nidOrPassportImageUrl;
        DrivingLicenseNumber = drivingLicenseNumber;
        DrivingLicenseImageUrl = drivingLicenseImageUrl;
    }

    public void Activate() => IsActive = true;

    public void Deactivate() => IsActive = false;
}
