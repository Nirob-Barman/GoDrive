using CleanArchitecture.Api.Common;
using CleanArchitecture.Application.Common.Constants;
using CleanArchitecture.Application.Payments.Queries.GetAllPayments;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.Api.Controllers;

[ApiController]
[Route("api/admin/payments")]
[Authorize(Roles = Roles.Admin)]
public class AdminPaymentsController : ControllerBase
{
    private readonly ISender _sender;

    public AdminPaymentsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllPayments([FromQuery] GetAllPaymentsQuery query, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(query, cancellationToken);
        return Ok(ApiResponse.Ok(result));
    }
}
