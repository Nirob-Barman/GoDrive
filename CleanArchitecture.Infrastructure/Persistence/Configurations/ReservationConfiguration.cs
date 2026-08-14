using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CleanArchitecture.Infrastructure.Persistence.Configurations;

public class ReservationConfiguration : IEntityTypeConfiguration<Reservation>
{
    public void Configure(EntityTypeBuilder<Reservation> builder)
    {
        builder.Property(r => r.UserId).IsRequired().HasMaxLength(450);
        builder.Property(r => r.PricePerHourAtBooking).HasColumnType("decimal(10,2)");
        builder.Property(r => r.TotalAmount).HasColumnType("decimal(10,2)");
        builder.Property(r => r.Status).HasConversion<string>().HasMaxLength(30);
        builder.Property(r => r.PaymentStatus).HasConversion<string>().HasMaxLength(30);
        builder.Property(r => r.RejectionReason).HasMaxLength(1000);

        // Restrict (not Cascade): a car or user deletion must never silently wipe reservation history.
        builder.HasOne(r => r.Car)
            .WithMany()
            .HasForeignKey(r => r.CarId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<ApplicationUser>()
            .WithMany()
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(r => r.CarId);
        builder.HasIndex(r => r.UserId);
        builder.HasIndex(r => r.Status);
    }
}
