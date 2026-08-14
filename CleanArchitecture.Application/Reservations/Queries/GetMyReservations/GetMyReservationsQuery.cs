using CleanArchitecture.Application.Common.Models;
using CleanArchitecture.Application.Reservations.Common;
using MediatR;

namespace CleanArchitecture.Application.Reservations.Queries.GetMyReservations;

public record GetMyReservationsQuery(int PageNumber = 1, int PageSize = 10) : IRequest<PaginatedList<ReservationDto>>;
