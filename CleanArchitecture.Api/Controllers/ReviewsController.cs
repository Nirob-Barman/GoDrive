using CleanArchitecture.Api.Common;
using CleanArchitecture.Api.Controllers.Requests;
using CleanArchitecture.Application.Reviews.Commands.DeleteReview;
using CleanArchitecture.Application.Reviews.Commands.UpdateReview;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.Api.Controllers;

[ApiController]
[Route("api/reviews")]
[Authorize]
public class ReviewsController : ControllerBase
{
    private readonly ISender _sender;

    public ReviewsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateReview(int id, UpdateReviewRequest request, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new UpdateReviewCommand(id, request.Rating, request.Comment), cancellationToken);
        return Ok(ApiResponse.Ok(result, "Review updated"));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteReview(int id, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteReviewCommand(id), cancellationToken);
        return NoContent();
    }
}
