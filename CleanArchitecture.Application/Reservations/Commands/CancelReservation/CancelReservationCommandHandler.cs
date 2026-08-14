using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using MediatR;

namespace CleanArchitecture.Application.Reservations.Commands.CancelReservation;

public class CancelReservationCommandHandler : IRequestHandler<CancelReservationCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public CancelReservationCommandHandler(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task Handle(CancelReservationCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId ?? throw new UnauthorizedAccessException();

        var reservation = await _context.Reservations.FindAsync([request.Id], cancellationToken)
            ?? throw new NotFoundException("Reservation", request.Id);

        if (reservation.UserId != userId)
        {
            throw new ForbiddenAccessException("You do not have permission to cancel this reservation.");
        }

        reservation.Cancel();

        await _context.SaveChangesAsync(cancellationToken);
    }
}
