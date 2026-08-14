using CleanArchitecture.Application.Common.Models;
using CleanArchitecture.Application.Reservations.Common;
using CleanArchitecture.Domain.Enums;
using MediatR;

namespace CleanArchitecture.Application.Reservations.Queries.GetAllReservations;

public record GetAllReservationsQuery(
    ReservationStatus? Status,
    int PageNumber = 1,
    int PageSize = 20) : IRequest<PaginatedList<ReservationDto>>;
