using Microsoft.AspNetCore.Identity;

namespace CleanArchitecture.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? ProfileImageUrl { get; set; }
    public string? NIDOrPassportNumber { get; set; }
    public string? NIDOrPassportImageUrl { get; set; }
    public string? DrivingLicenseNumber { get; set; }
    public string? DrivingLicenseImageUrl { get; set; }
    public bool IsActive { get; set; } = true;
}
