using MediatR;

namespace CleanArchitecture.Application.Payments.Commands.ProcessStripeWebhook;

public record ProcessStripeWebhookCommand(string RequestBody, string SignatureHeader) : IRequest;
