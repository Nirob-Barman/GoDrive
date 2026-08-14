using System.Text.Json;
using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Outbox;
using CleanArchitecture.Application.Reservations.Common;
using CleanArchitecture.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Reservations.Commands.RejectReservation;

public class RejectReservationCommandHandler : IRequestHandler<RejectReservationCommand, ReservationDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IIdentityService _identityService;

    public RejectReservationCommandHandler(IApplicationDbContext context, IIdentityService identityService)
    {
        _context = context;
        _identityService = identityService;
    }

    public async Task<ReservationDto> Handle(RejectReservationCommand request, CancellationToken cancellationToken)
    {
        var reservation = await _context.Reservations
            .Include(r => r.Car)
            .FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException("Reservation", request.Id);

        reservation.Reject(request.Reason);

        var profile = await _identityService.GetProfileAsync(reservation.UserId, cancellationToken);
        if (profile is not null)
        {
            var payload = JsonSerializer.Serialize(new ReservationRejectedEmailPayload(
                profile.Email, profile.FullName, reservation.Id, reservation.Car.Name, reservation.RejectionReason));

            _context.OutboxMessages.Add(OutboxMessage.Create(OutboxMessageTypes.ReservationRejectedEmail, payload));
        }

        await _context.SaveChangesAsync(cancellationToken);

        return ReservationMapper.ToDto(reservation);
    }
}
