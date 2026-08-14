using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Reservations.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Reservations.Commands.ReturnCar;

public class ReturnCarCommandHandler : IRequestHandler<ReturnCarCommand, ReservationDto>
{
    private readonly IApplicationDbContext _context;

    public ReturnCarCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ReservationDto> Handle(ReturnCarCommand request, CancellationToken cancellationToken)
    {
        var reservation = await _context.Reservations
            .Include(r => r.Car)
            .FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException("Reservation", request.Id);

        reservation.MarkReturned();

        await _context.SaveChangesAsync(cancellationToken);

        return ReservationMapper.ToDto(reservation);
    }
}
