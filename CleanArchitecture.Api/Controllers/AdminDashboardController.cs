using CleanArchitecture.Api.Common;
using CleanArchitecture.Application.Common.Constants;
using CleanArchitecture.Application.Dashboard.Queries.GetCarUtilization;
using CleanArchitecture.Application.Dashboard.Queries.GetDashboardStatistics;
using CleanArchitecture.Application.Dashboard.Queries.GetRevenueByPeriod;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.Api.Controllers;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize(Roles = Roles.Admin)]
public class AdminDashboardController : ControllerBase
{
    private readonly ISender _sender;

    public AdminDashboardController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("statistics")]
    public async Task<IActionResult> GetStatistics(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetDashboardStatisticsQuery(), cancellationToken);
        return Ok(ApiResponse.Ok(result));
    }

    [HttpGet("revenue")]
    public async Task<IActionResult> GetRevenueByPeriod([FromQuery] GetRevenueByPeriodQuery query, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(query, cancellationToken);
        return Ok(ApiResponse.Ok(result));
    }

    [HttpGet("car-utilization")]
    public async Task<IActionResult> GetCarUtilization([FromQuery] GetCarUtilizationQuery query, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(query, cancellationToken);
        return Ok(ApiResponse.Ok(result));
    }
}
