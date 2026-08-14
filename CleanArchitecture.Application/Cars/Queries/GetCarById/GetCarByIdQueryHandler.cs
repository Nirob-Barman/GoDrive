using CleanArchitecture.Application.Cars.Common;
using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Cars.Queries.GetCarById;

public class GetCarByIdQueryHandler : IRequestHandler<GetCarByIdQuery, CarDetailsDto>
{
    private readonly IApplicationDbContext _context;

    public GetCarByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CarDetailsDto> Handle(GetCarByIdQuery request, CancellationToken cancellationToken)
    {
        var car = await _context.Cars
            .Include(c => c.Images)
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException("Car", request.Id);

        var (averageRating, reviewCount) = await CarReviewStatsHelper.GetStatsAsync(_context, car.Id, cancellationToken);

        return CarMapper.ToDetailsDto(car, averageRating, reviewCount);
    }
}
