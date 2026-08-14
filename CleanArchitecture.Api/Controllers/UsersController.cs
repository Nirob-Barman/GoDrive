using CleanArchitecture.Api.Common;
using CleanArchitecture.Api.Controllers.Requests;
using CleanArchitecture.Application.Users.Commands.UpdateProfile;
using CleanArchitecture.Application.Users.Queries.GetMyProfile;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly ISender _sender;

    public UsersController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetMyProfileQuery(), cancellationToken);
        return Ok(ApiResponse.Ok(result));
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMyProfile([FromForm] UpdateProfileRequest request, CancellationToken cancellationToken)
    {
        var command = new UpdateProfileCommand(
            request.FullName,
            request.PhoneNumber,
            request.Address,
            request.NIDOrPassportNumber,
            request.DrivingLicenseNumber,
            request.ProfileImage?.OpenReadStream(),
            request.ProfileImage?.FileName,
            request.NIDOrPassportImage?.OpenReadStream(),
            request.NIDOrPassportImage?.FileName,
            request.DrivingLicenseImage?.OpenReadStream(),
            request.DrivingLicenseImage?.FileName);

        var result = await _sender.Send(command, cancellationToken);
        return Ok(ApiResponse.Ok(result, "Profile updated"));
    }
}
