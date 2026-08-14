using CleanArchitecture.Application.Cars.Common;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Models;
using CleanArchitecture.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Cars.Queries.GetCars;

public class GetCarsQueryHandler : IRequestHandler<GetCarsQuery, PaginatedList<CarListItemDto>>
{
    private readonly IApplicationDbContext _context;

    public GetCarsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<CarListItemDto>> Handle(GetCarsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Cars
            .Include(c => c.Images)
            .Where(c => c.Status == CarStatus.Active)
            .AsQueryable();

        query = CarQueryFilters.Apply(
            query, request.Search, request.CarType, request.FuelType, request.Transmission,
            request.MinPrice, request.MaxPrice, request.Location);

        query = query.OrderBy(c => c.Name);

        var paged = await PaginatedList<Domain.Entities.Car>.CreateAsync(
            query, request.PageNumber, request.PageSize, cancellationToken);

        return new PaginatedList<CarListItemDto>(
            paged.Items.Select(CarMapper.ToListItemDto).ToArray(),
            paged.TotalCount,
            paged.PageNumber,
            request.PageSize);
    }
}
