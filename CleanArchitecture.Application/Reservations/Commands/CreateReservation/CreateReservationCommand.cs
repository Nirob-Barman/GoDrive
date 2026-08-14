using CleanArchitecture.Application.Reservations.Common;
using MediatR;

namespace CleanArchitecture.Application.Reservations.Commands.CreateReservation;

public record CreateReservationCommand(int CarId, DateTime PickupDate, DateTime DropoffDate) : IRequest<ReservationDto>;
