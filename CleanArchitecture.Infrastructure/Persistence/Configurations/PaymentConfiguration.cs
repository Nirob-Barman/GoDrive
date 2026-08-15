using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CleanArchitecture.Infrastructure.Persistence.Configurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.Property(p => p.UserId).IsRequired().HasMaxLength(450);
        builder.Property(p => p.Amount).HasColumnType("decimal(10,2)");
        builder.Property(p => p.Currency).IsRequired().HasMaxLength(10);
        builder.Property(p => p.StripeSessionId).HasMaxLength(200);
        builder.Property(p => p.StripePaymentIntentId).HasMaxLength(200);
        builder.Property(p => p.Status).HasConversion<string>().HasMaxLength(30);

        builder.HasOne(p => p.Reservation)
            .WithMany()
            .HasForeignKey(p => p.ReservationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<ApplicationUser>()
            .WithMany()
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(p => p.StripeSessionId);
        builder.HasIndex(p => p.StripePaymentIntentId);
        builder.HasIndex(p => p.ReservationId);
    }
}
