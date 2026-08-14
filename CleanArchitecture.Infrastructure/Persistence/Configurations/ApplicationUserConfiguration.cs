using CleanArchitecture.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CleanArchitecture.Infrastructure.Persistence.Configurations;

public class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
{
    public void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        builder.Property(u => u.FullName).IsRequired().HasMaxLength(200);
        builder.Property(u => u.Address).HasMaxLength(500);
        builder.Property(u => u.ProfileImageUrl).HasMaxLength(1000);
        builder.Property(u => u.NIDOrPassportNumber).HasMaxLength(100);
        builder.Property(u => u.NIDOrPassportImageUrl).HasMaxLength(1000);
        builder.Property(u => u.DrivingLicenseNumber).HasMaxLength(100);
        builder.Property(u => u.DrivingLicenseImageUrl).HasMaxLength(1000);
    }
}
