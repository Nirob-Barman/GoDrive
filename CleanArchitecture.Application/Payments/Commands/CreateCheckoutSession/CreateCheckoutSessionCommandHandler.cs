using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Payments.Commands.CreateCheckoutSession;

public class CreateCheckoutSessionCommandHandler : IRequestHandler<CreateCheckoutSessionCommand, CheckoutSessionDto>
{
    private const string Currency = "usd";

    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IIdentityService _identityService;
    private readonly IPaymentService _paymentService;

    public CreateCheckoutSessionCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IIdentityService identityService,
        IPaymentService paymentService)
    {
        _context = context;
        _currentUser = currentUser;
        _identityService = identityService;
        _paymentService = paymentService;
    }

    public async Task<CheckoutSessionDto> Handle(CreateCheckoutSessionCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId ?? throw new UnauthorizedAccessException();

        var reservation = await _context.Reservations
            .FirstOrDefaultAsync(r => r.Id == request.ReservationId, cancellationToken)
            ?? throw new NotFoundException("Reservation", request.ReservationId);

        if (reservation.UserId != userId)
        {
            throw new ForbiddenAccessException("You do not have permission to pay for this reservation.");
        }

        if (reservation.Status != ReservationStatus.Approved)
        {
            throw new ConflictException("Only an approved reservation can be paid for.");
        }

        if (reservation.PaymentStatus == PaymentStatus.Paid)
        {
            throw new ConflictException("This reservation has already been paid for.");
        }

        var profile = await _identityService.GetProfileAsync(userId, cancellationToken)
            ?? throw new UnauthorizedAccessException();

        // Server-side amount, taken from the reservation's own stored total - never trusted from the client.
        var session = await _paymentService.CreateCheckoutSessionAsync(
            reservation.Id, reservation.TotalAmount, Currency, profile.Email, cancellationToken);

        var payment = Payment.Create(reservation.Id, userId, reservation.TotalAmount, Currency, session.SessionId);

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync(cancellationToken);

        return new CheckoutSessionDto(session.SessionId, session.CheckoutUrl);
    }
}
