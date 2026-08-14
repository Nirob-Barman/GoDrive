using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Models;
using CleanArchitecture.Application.Reviews.Common;
using CleanArchitecture.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Reviews.Queries.GetCarReviews;

public class GetCarReviewsQueryHandler : IRequestHandler<GetCarReviewsQuery, PaginatedList<ReviewDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IIdentityService _identityService;

    public GetCarReviewsQueryHandler(IApplicationDbContext context, IIdentityService identityService)
    {
        _context = context;
        _identityService = identityService;
    }

    public async Task<PaginatedList<ReviewDto>> Handle(GetCarReviewsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Reviews
            .Where(r => r.CarId == request.CarId)
            .OrderByDescending(r => r.CreatedAtUtc);

        var paged = await PaginatedList<Review>.CreateAsync(query, request.PageNumber, request.PageSize, cancellationToken);

        var fullNames = await _identityService.GetFullNamesAsync(
            paged.Items.Select(r => r.UserId), cancellationToken);

        var items = paged.Items
            .Select(r => ReviewMapper.ToDto(r, fullNames.GetValueOrDefault(r.UserId, string.Empty)))
            .ToArray();

        return new PaginatedList<ReviewDto>(items, paged.TotalCount, paged.PageNumber, request.PageSize);
    }
}
