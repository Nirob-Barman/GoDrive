using CleanArchitecture.Api.Common;
using CleanArchitecture.Api.Controllers.Requests;
using CleanArchitecture.Application.Reservations.Commands.CancelReservation;
using CleanArchitecture.Application.Reservations.Commands.CreateReservation;
using CleanArchitecture.Application.Reservations.Commands.UpdateReservation;
using CleanArchitecture.Application.Reservations.Queries.GetMyReservations;
using CleanArchitecture.Application.Reservations.Queries.GetReservationById;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.Api.Controllers;

[ApiController]
[Route("api/reservations")]
[Authorize]
public class ReservationsController : ControllerBase
{
    private readonly ISender _sender;

    public ReservationsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost]
    public async Task<IActionResult> CreateReservation(CreateReservationCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, ApiResponse.Ok(result, "Reservation created"));
    }

    [HttpGet]
    public async Task<IActionResult> GetMyReservations([FromQuery] GetMyReservationsQuery query, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(query, cancellationToken);
        return Ok(ApiResponse.Ok(result));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetReservationById(int id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetReservationByIdQuery(id), cancellationToken);
        return Ok(ApiResponse.Ok(result));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateReservation(int id, UpdateReservationRequest request, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new UpdateReservationCommand(id, request.PickupDate, request.DropoffDate), cancellationToken);
        return Ok(ApiResponse.Ok(result, "Reservation updated"));
    }

    [HttpPut("{id:int}/cancel")]
    public async Task<IActionResult> CancelReservation(int id, CancellationToken cancellationToken)
    {
        await _sender.Send(new CancelReservationCommand(id), cancellationToken);
        return NoContent();
    }
}
