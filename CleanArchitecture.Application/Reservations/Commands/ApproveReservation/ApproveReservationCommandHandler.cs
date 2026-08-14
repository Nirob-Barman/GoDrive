using System.Text.Json;
using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Outbox;
using CleanArchitecture.Application.Reservations.Common;
using CleanArchitecture.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Reservations.Commands.ApproveReservation;

public class ApproveReservationCommandHandler : IRequestHandler<ApproveReservationCommand, ReservationDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IIdentityService _identityService;

    public ApproveReservationCommandHandler(IApplicationDbContext context, IIdentityService identityService)
    {
        _context = context;
        _identityService = identityService;
    }

    public async Task<ReservationDto> Handle(ApproveReservationCommand request, CancellationToken cancellationToken)
    {
        var reservation = await _context.Reservations
            .Include(r => r.Car)
            .FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException("Reservation", request.Id);

        reservation.Approve();

        var profile = await _identityService.GetProfileAsync(reservation.UserId, cancellationToken);
        if (profile is not null)
        {
            var payload = JsonSerializer.Serialize(new ReservationApprovedEmailPayload(
                profile.Email, profile.FullName, reservation.Id, reservation.Car.Name, reservation.TotalAmount));

            _context.OutboxMessages.Add(OutboxMessage.Create(OutboxMessageTypes.ReservationApprovedEmail, payload));
        }

        await _context.SaveChangesAsync(cancellationToken);

        return ReservationMapper.ToDto(reservation);
    }
}
