using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Payments.Commands.ProcessStripeWebhook;

public class ProcessStripeWebhookCommandHandler : IRequestHandler<ProcessStripeWebhookCommand>
{
    private readonly IPaymentService _paymentService;
    private readonly IApplicationDbContext _context;

    public ProcessStripeWebhookCommandHandler(IPaymentService paymentService, IApplicationDbContext context)
    {
        _paymentService = paymentService;
        _context = context;
    }

    public async Task Handle(ProcessStripeWebhookCommand request, CancellationToken cancellationToken)
    {
        var result = _paymentService.ParseWebhookEvent(request.RequestBody, request.SignatureHeader);

        if (result.IsCheckoutCompleted && result.SessionId is not null)
        {
            var payment = await _context.Payments
                .FirstOrDefaultAsync(p => p.StripeSessionId == result.SessionId, cancellationToken);

            if (payment is not null && payment.Status != PaymentTransactionStatus.Succeeded)
            {
                payment.MarkSucceeded(result.PaymentIntentId ?? string.Empty);

                var reservation = await _context.Reservations
                    .FirstOrDefaultAsync(r => r.Id == payment.ReservationId, cancellationToken);

                reservation?.MarkPaid();

                await _context.SaveChangesAsync(cancellationToken);
            }
        }
        else if (result.IsPaymentFailed && result.PaymentIntentId is not null)
        {
            var payment = await _context.Payments
                .FirstOrDefaultAsync(p => p.StripePaymentIntentId == result.PaymentIntentId, cancellationToken);

            if (payment is not null)
            {
                payment.MarkFailed();
                await _context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
