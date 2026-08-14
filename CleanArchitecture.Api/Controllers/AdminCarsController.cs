using CleanArchitecture.Api.Common;
using CleanArchitecture.Api.Controllers.Requests;
using CleanArchitecture.Application.Cars.Commands.AddCarImages;
using CleanArchitecture.Application.Cars.Commands.CreateCar;
using CleanArchitecture.Application.Cars.Commands.DeleteCar;
using CleanArchitecture.Application.Cars.Commands.DeleteCarImage;
using CleanArchitecture.Application.Cars.Commands.UpdateCar;
using CleanArchitecture.Application.Common.Constants;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.Api.Controllers;

[ApiController]
[Route("api/admin/cars")]
[Authorize(Roles = Roles.Admin)]
public class AdminCarsController : ControllerBase
{
    private readonly ISender _sender;

    public AdminCarsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost]
    public async Task<IActionResult> CreateCar(CreateCarCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, ApiResponse.Ok(result, "Car created"));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateCar(int id, UpdateCarRequest request, CancellationToken cancellationToken)
    {
        var command = new UpdateCarCommand(
            id,
            request.Name,
            request.Brand,
            request.Model,
            request.Year,
            request.Description,
            request.CarType,
            request.FuelType,
            request.Transmission,
            request.Seats,
            request.PricePerHour,
            request.Location,
            request.Status);

        var result = await _sender.Send(command, cancellationToken);
        return Ok(ApiResponse.Ok(result, "Car updated"));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCar(int id, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteCarCommand(id), cancellationToken);
        return NoContent();
    }

    [HttpPost("{id:int}/images")]
    public async Task<IActionResult> AddImages(int id, [FromForm] List<IFormFile> images, CancellationToken cancellationToken)
    {
        var items = images.Select(f => new ImageUploadItem(f.OpenReadStream(), f.FileName)).ToArray();
        var result = await _sender.Send(new AddCarImagesCommand(id, items), cancellationToken);
        return Ok(ApiResponse.Ok(result, "Images uploaded"));
    }

    [HttpDelete("{id:int}/images/{imageId:int}")]
    public async Task<IActionResult> DeleteImage(int id, int imageId, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteCarImageCommand(id, imageId), cancellationToken);
        return NoContent();
    }
}
