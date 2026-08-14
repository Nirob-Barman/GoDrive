using CleanArchitecture.Application.Cars.Common;
using MediatR;

namespace CleanArchitecture.Application.Cars.Queries.GetCarById;

public record GetCarByIdQuery(int Id) : IRequest<CarDetailsDto>;
