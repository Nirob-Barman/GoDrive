using CleanArchitecture.Api.Common;
using CleanArchitecture.Api.Controllers.Requests;
using CleanArchitecture.Application.Common.Constants;
using CleanArchitecture.Application.Reservations.Commands.ApproveReservation;
using CleanArchitecture.Application.Reservations.Commands.MarkPickedUp;
using CleanArchitecture.Application.Reservations.Commands.RejectReservation;
using CleanArchitecture.Application.Reservations.Commands.ReturnCar;
using CleanArchitecture.Application.Reservations.Queries.GetAllReservations;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.Api.Controllers;

[ApiController]
[Route("api/admin/reservations")]
[Authorize(Roles = Roles.Admin)]
public class AdminReservationsController : ControllerBase
{
    private readonly ISender _sender;

    public AdminReservationsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllReservations([FromQuery] GetAllReservationsQuery query, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(query, cancellationToken);
        return Ok(ApiResponse.Ok(result));
    }

    [HttpPut("{id:int}/approve")]
    public async Task<IActionResult> Approve(int id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new ApproveReservationCommand(id), cancellationToken);
        return Ok(ApiResponse.Ok(result, "Reservation approved"));
    }

    [HttpPut("{id:int}/reject")]
    public async Task<IActionResult> Reject(int id, RejectReservationRequest request, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new RejectReservationCommand(id, request.Reason), cancellationToken);
        return Ok(ApiResponse.Ok(result, "Reservation rejected"));
    }

    [HttpPut("{id:int}/pickup")]
    public async Task<IActionResult> MarkPickedUp(int id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new MarkPickedUpCommand(id), cancellationToken);
        return Ok(ApiResponse.Ok(result, "Car marked as picked up"));
    }

    [HttpPut("{id:int}/return")]
    public async Task<IActionResult> ReturnCar(int id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new ReturnCarCommand(id), cancellationToken);
        return Ok(ApiResponse.Ok(result, "Car marked as returned"));
    }
}
