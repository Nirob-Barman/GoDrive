using MediatR;

namespace CleanArchitecture.Application.Payments.Commands.CreateCheckoutSession;

public record CreateCheckoutSessionCommand(int ReservationId) : IRequest<CheckoutSessionDto>;
