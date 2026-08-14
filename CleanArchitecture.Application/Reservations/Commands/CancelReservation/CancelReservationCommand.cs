using MediatR;

namespace CleanArchitecture.Application.Reservations.Commands.CancelReservation;

public record CancelReservationCommand(int Id) : IRequest;
