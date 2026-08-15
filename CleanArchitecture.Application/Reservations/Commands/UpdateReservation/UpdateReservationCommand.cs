using CleanArchitecture.Application.Reservations.Common;
using MediatR;

namespace CleanArchitecture.Application.Reservations.Commands.UpdateReservation;

public record UpdateReservationCommand(int Id, DateTime PickupDate, DateTime DropoffDate) : IRequest<ReservationDto>;
