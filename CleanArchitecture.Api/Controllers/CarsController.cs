using CleanArchitecture.Api.Common;
using CleanArchitecture.Api.Controllers.Requests;
using CleanArchitecture.Application.Cars.Queries.GetAvailableCars;
using CleanArchitecture.Application.Cars.Queries.GetCarById;
using CleanArchitecture.Application.Cars.Queries.GetCars;
using CleanArchitecture.Application.Reviews.Commands.CreateReview;
using CleanArchitecture.Application.Reviews.Queries.GetCarReviews;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.Api.Controllers;

[ApiController]
[Route("api/cars")]
public class CarsController : ControllerBase
{
    private readonly ISender _sender;

    public CarsController(ISender sender)
    {
        _sender = sender;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetCars([FromQuery] GetCarsQuery query, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(query, cancellationToken);
        return Ok(ApiResponse.Ok(result));
    }

    [AllowAnonymous]
    [HttpGet("available")]
    public async Task<IActionResult> GetAvailableCars([FromQuery] GetAvailableCarsQuery query, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(query, cancellationToken);
        return Ok(ApiResponse.Ok(result));
    }

    [AllowAnonymous]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetCarById(int id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetCarByIdQuery(id), cancellationToken);
        return Ok(ApiResponse.Ok(result));
    }

    [AllowAnonymous]
    [HttpGet("{carId:int}/reviews")]
    public async Task<IActionResult> GetCarReviews(
        int carId, [FromQuery] int pageNumber, [FromQuery] int pageSize, CancellationToken cancellationToken)
    {
        var query = new GetCarReviewsQuery(carId, pageNumber == 0 ? 1 : pageNumber, pageSize == 0 ? 10 : pageSize);
        var result = await _sender.Send(query, cancellationToken);
        return Ok(ApiResponse.Ok(result));
    }

    [Authorize]
    [HttpPost("{carId:int}/reviews")]
    public async Task<IActionResult> CreateReview(int carId, CreateReviewRequest request, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new CreateReviewCommand(carId, request.Rating, request.Comment), cancellationToken);
        return StatusCode(StatusCodes.Status201Created, ApiResponse.Ok(result, "Review created"));
    }
}
