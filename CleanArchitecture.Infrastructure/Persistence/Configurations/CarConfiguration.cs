using CleanArchitecture.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CleanArchitecture.Infrastructure.Persistence.Configurations;

public class CarConfiguration : IEntityTypeConfiguration<Car>
{
    public void Configure(EntityTypeBuilder<Car> builder)
    {
        builder.Property(c => c.Name).IsRequired().HasMaxLength(200);
        builder.Property(c => c.Brand).IsRequired().HasMaxLength(100);
        builder.Property(c => c.Model).IsRequired().HasMaxLength(100);
        builder.Property(c => c.Description).HasMaxLength(2000);
        builder.Property(c => c.Location).IsRequired().HasMaxLength(200);
        builder.Property(c => c.PricePerHour).HasColumnType("decimal(10,2)");

        builder.Property(c => c.CarType).HasConversion<string>().HasMaxLength(30);
        builder.Property(c => c.FuelType).HasConversion<string>().HasMaxLength(30);
        builder.Property(c => c.Transmission).HasConversion<string>().HasMaxLength(30);
        builder.Property(c => c.Status).HasConversion<string>().HasMaxLength(30);

        builder.HasMany(c => c.Images)
            .WithOne(i => i.Car)
            .HasForeignKey(i => i.CarId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(c => c.CarType);
        builder.HasIndex(c => c.Status);
        builder.HasIndex(c => c.PricePerHour);
    }
}
