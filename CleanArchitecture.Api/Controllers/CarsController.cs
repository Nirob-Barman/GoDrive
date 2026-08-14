using CleanArchitecture.Api.Common;
using CleanArchitecture.Application.Cars.Queries.GetAvailableCars;
using CleanArchitecture.Application.Cars.Queries.GetCarById;
using CleanArchitecture.Application.Cars.Queries.GetCars;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.Api.Controllers;

[ApiController]
[Route("api/cars")]
[AllowAnonymous]
public class CarsController : ControllerBase
{
    private readonly ISender _sender;

    public CarsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<IActionResult> GetCars([FromQuery] GetCarsQuery query, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(query, cancellationToken);
        return Ok(ApiResponse.Ok(result));
    }

    [HttpGet("available")]
    public async Task<IActionResult> GetAvailableCars([FromQuery] GetAvailableCarsQuery query, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(query, cancellationToken);
        return Ok(ApiResponse.Ok(result));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetCarById(int id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetCarByIdQuery(id), cancellationToken);
        return Ok(ApiResponse.Ok(result));
    }
}
