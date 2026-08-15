using CleanArchitecture.Api.Common;
using CleanArchitecture.Application.Payments.Commands.CreateCheckoutSession;
using CleanArchitecture.Application.Payments.Commands.ProcessStripeWebhook;
using CleanArchitecture.Application.Payments.Queries.GetMyPayments;
using CleanArchitecture.Application.Payments.Queries.GetPaymentById;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.Api.Controllers;

[ApiController]
[Route("api/payments")]
[Authorize]
public class PaymentsController : ControllerBase
{
    private readonly ISender _sender;

    public PaymentsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost("checkout/{reservationId:int}")]
    public async Task<IActionResult> CreateCheckoutSession(int reservationId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new CreateCheckoutSessionCommand(reservationId), cancellationToken);
        return Ok(ApiResponse.Ok(result, "Checkout session created"));
    }

    [HttpGet]
    public async Task<IActionResult> GetMyPayments([FromQuery] GetMyPaymentsQuery query, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(query, cancellationToken);
        return Ok(ApiResponse.Ok(result));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetPaymentById(int id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetPaymentByIdQuery(id), cancellationToken);
        return Ok(ApiResponse.Ok(result));
    }

    // Stripe calls this directly - no user is authenticated, integrity comes from the signature check instead.
    [AllowAnonymous]
    [HttpPost("webhook")]
    public async Task<IActionResult> StripeWebhook(CancellationToken cancellationToken)
    {
        using var reader = new StreamReader(Request.Body);
        var requestBody = await reader.ReadToEndAsync(cancellationToken);
        var signature = Request.Headers["Stripe-Signature"].ToString();

        await _sender.Send(new ProcessStripeWebhookCommand(requestBody, signature), cancellationToken);

        return Ok();
    }
}
