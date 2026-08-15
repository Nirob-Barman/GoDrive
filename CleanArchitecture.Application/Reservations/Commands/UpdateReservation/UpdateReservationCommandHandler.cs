using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Reservations.Common;
using CleanArchitecture.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Reservations.Commands.UpdateReservation;

public class UpdateReservationCommandHandler : IRequestHandler<UpdateReservationCommand, ReservationDto>
{
    private static readonly ReservationStatus[] BlockingStatuses =
    {
        ReservationStatus.Pending, ReservationStatus.Approved, ReservationStatus.PickedUp
    };

    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public UpdateReservationCommandHandler(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<ReservationDto> Handle(UpdateReservationCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId ?? throw new UnauthorizedAccessException();

        var reservation = await _context.Reservations
            .Include(r => r.Car)
            .FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException("Reservation", request.Id);

        if (reservation.UserId != userId)
        {
            throw new ForbiddenAccessException("You do not have permission to modify this reservation.");
        }

        var hasOverlap = await _context.Reservations.AnyAsync(
            r => r.Id != request.Id
                && r.CarId == reservation.CarId
                && BlockingStatuses.Contains(r.Status)
                && r.PickupDate < request.DropoffDate
                && request.PickupDate < r.DropoffDate,
            cancellationToken);

        if (hasOverlap)
        {
            throw new ConflictException("This car is already reserved for the selected period.");
        }

        reservation.Reschedule(request.PickupDate, request.DropoffDate);

        await _context.SaveChangesAsync(cancellationToken);

        return ReservationMapper.ToDto(reservation);
    }
}
