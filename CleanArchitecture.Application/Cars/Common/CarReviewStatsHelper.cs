using CleanArchitecture.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Cars.Common;

public static class CarReviewStatsHelper
{
    public static async Task<(decimal? Average, int Count)> GetStatsAsync(
        IApplicationDbContext context, int carId, CancellationToken cancellationToken)
    {
        var ratings = await context.Reviews
            .Where(r => r.CarId == carId)
            .Select(r => r.Rating)
            .ToListAsync(cancellationToken);

        return ratings.Count == 0 ? (null, 0) : (Math.Round((decimal)ratings.Average(), 2), ratings.Count);
    }
}
