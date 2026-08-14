using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Reservations.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Reservations.Commands.MarkPickedUp;

public class MarkPickedUpCommandHandler : IRequestHandler<MarkPickedUpCommand, ReservationDto>
{
    private readonly IApplicationDbContext _context;

    public MarkPickedUpCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ReservationDto> Handle(MarkPickedUpCommand request, CancellationToken cancellationToken)
    {
        var reservation = await _context.Reservations
            .Include(r => r.Car)
            .FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException("Reservation", request.Id);

        reservation.MarkPickedUp();

        await _context.SaveChangesAsync(cancellationToken);

        return ReservationMapper.ToDto(reservation);
    }
}
