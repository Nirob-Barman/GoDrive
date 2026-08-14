using Microsoft.AspNetCore.Http;

namespace CleanArchitecture.Api.Controllers.Requests;

public class UpdateProfileRequest
{
    public string FullName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public string? NIDOrPassportNumber { get; set; }
    public string? DrivingLicenseNumber { get; set; }
    public IFormFile? ProfileImage { get; set; }
    public IFormFile? NIDOrPassportImage { get; set; }
    public IFormFile? DrivingLicenseImage { get; set; }
}
