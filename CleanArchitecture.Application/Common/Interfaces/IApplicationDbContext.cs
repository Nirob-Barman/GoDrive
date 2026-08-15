using CleanArchitecture.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Car> Cars { get; }
    DbSet<CarImage> CarImages { get; }
    DbSet<RefreshToken> RefreshTokens { get; }
    DbSet<Reservation> Reservations { get; }
    DbSet<OutboxMessage> OutboxMessages { get; }
    DbSet<Review> Reviews { get; }
    DbSet<Payment> Payments { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
