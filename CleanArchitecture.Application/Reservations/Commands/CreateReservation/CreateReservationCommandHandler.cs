using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Reservations.Common;
using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Reservations.Commands.CreateReservation;

public class CreateReservationCommandHandler : IRequestHandler<CreateReservationCommand, ReservationDto>
{
    private static readonly ReservationStatus[] BlockingStatuses =
    {
        ReservationStatus.Pending, ReservationStatus.Approved, ReservationStatus.PickedUp
    };

    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IIdentityService _identityService;

    public CreateReservationCommandHandler(
        IApplicationDbContext context, ICurrentUserService currentUser, IIdentityService identityService)
    {
        _context = context;
        _currentUser = currentUser;
        _identityService = identityService;
    }

    public async Task<ReservationDto> Handle(CreateReservationCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId ?? throw new UnauthorizedAccessException();

        var profile = await _identityService.GetProfileAsync(userId, cancellationToken)
            ?? throw new UnauthorizedAccessException();

        if (string.IsNullOrWhiteSpace(profile.NIDOrPassportNumber) || string.IsNullOrWhiteSpace(profile.DrivingLicenseNumber))
        {
            throw new IncompleteProfileException(
                "A National ID/Passport number and Driving License number are required before booking. Please complete your profile first.");
        }

        var car = await _context.Cars.FirstOrDefaultAsync(c => c.Id == request.CarId, cancellationToken)
            ?? throw new NotFoundException("Car", request.CarId);

        if (car.Status != CarStatus.Active)
        {
            throw new ConflictException("This car is not currently available for booking.");
        }

        var hasOverlap = await _context.Reservations.AnyAsync(
            r => r.CarId == request.CarId
                && BlockingStatuses.Contains(r.Status)
                && r.PickupDate < request.DropoffDate
                && request.PickupDate < r.DropoffDate,
            cancellationToken);

        if (hasOverlap)
        {
            throw new ConflictException("This car is already reserved for the selected period.");
        }

        var reservation = Reservation.Create(userId, car.Id, car.PricePerHour, request.PickupDate, request.DropoffDate);

        _context.Reservations.Add(reservation);
        await _context.SaveChangesAsync(cancellationToken);

        reservation = await _context.Reservations
            .Include(r => r.Car)
            .FirstAsync(r => r.Id == reservation.Id, cancellationToken);

        return ReservationMapper.ToDto(reservation);
    }
}
