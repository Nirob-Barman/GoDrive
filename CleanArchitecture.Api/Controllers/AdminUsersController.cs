using CleanArchitecture.Api.Common;
using CleanArchitecture.Api.Controllers.Requests;
using CleanArchitecture.Application.Common.Constants;
using CleanArchitecture.Application.Users.Commands.ChangeUserRole;
using CleanArchitecture.Application.Users.Commands.SetUserActiveStatus;
using CleanArchitecture.Application.Users.Queries.GetUserById;
using CleanArchitecture.Application.Users.Queries.GetUsers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.Api.Controllers;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = Roles.Admin)]
public class AdminUsersController : ControllerBase
{
    private readonly ISender _sender;

    public AdminUsersController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers([FromQuery] GetUsersQuery query, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(query, cancellationToken);
        return Ok(ApiResponse.Ok(result));
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserById(string userId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetUserByIdQuery(userId), cancellationToken);
        return Ok(ApiResponse.Ok(result));
    }

    [HttpPut("{userId}/status")]
    public async Task<IActionResult> SetUserActiveStatus(
        string userId, SetUserActiveStatusRequest request, CancellationToken cancellationToken)
    {
        await _sender.Send(new SetUserActiveStatusCommand(userId, request.IsActive), cancellationToken);
        return NoContent();
    }

    [HttpPut("{userId}/role")]
    public async Task<IActionResult> ChangeUserRole(
        string userId, ChangeUserRoleRequest request, CancellationToken cancellationToken)
    {
        await _sender.Send(new ChangeUserRoleCommand(userId, request.Role), cancellationToken);
        return NoContent();
    }
}
