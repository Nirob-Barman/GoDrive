using System.Text;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Infrastructure.Email;
using CleanArchitecture.Infrastructure.ExternalServices;
using CleanArchitecture.Infrastructure.Identity;
using CleanArchitecture.Infrastructure.Outbox;
using CleanArchitecture.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace CleanArchitecture.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        services
            .AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = false;
                options.User.RequireUniqueEmail = true;
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
                options.Lockout.AllowedForNewUsers = true;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        var jwtKey = configuration["Jwt:Key"] ?? string.Empty;
        var jwtIssuer = configuration["Jwt:Issuer"] ?? string.Empty;
        var jwtAudience = configuration["Jwt:Audience"] ?? string.Empty;
        var jwtExpirationMinutes = int.TryParse(configuration["Jwt:ExpirationMinutes"], out var minutes) ? minutes : 60;
        var refreshTokenExpirationDays = int.TryParse(configuration["Jwt:RefreshTokenExpirationDays"], out var days) ? days : 7;

        services.Configure<JwtSettings>(options =>
        {
            options.Key = jwtKey;
            options.Issuer = jwtIssuer;
            options.Audience = jwtAudience;
            options.ExpirationMinutes = jwtExpirationMinutes;
            options.RefreshTokenExpirationDays = refreshTokenExpirationDays;
        });

        services.Configure<CloudinaryOptions>(options =>
        {
            options.CloudName = configuration["Cloudinary:CloudName"] ?? string.Empty;
            options.ApiKey = configuration["Cloudinary:ApiKey"] ?? string.Empty;
            options.ApiSecret = configuration["Cloudinary:ApiSecret"] ?? string.Empty;
        });

        services.Configure<EmailSettings>(options =>
        {
            options.Enabled = bool.TryParse(configuration["EmailSettings:Enabled"], out var enabled) && enabled;
            options.SmtpServer = configuration["EmailSettings:SmtpServer"] ?? string.Empty;
            options.Port = int.TryParse(configuration["EmailSettings:Port"], out var port) ? port : 587;
            options.SenderEmail = configuration["EmailSettings:SenderEmail"] ?? string.Empty;
            options.SenderName = configuration["EmailSettings:SenderName"] ?? string.Empty;
            options.Username = configuration["EmailSettings:Username"] ?? string.Empty;
            options.Password = configuration["EmailSettings:Password"] ?? string.Empty;
            options.EnableSsl = !bool.TryParse(configuration["EmailSettings:EnableSsl"], out var enableSslParsed) || enableSslParsed;
        });

        services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                    ClockSkew = TimeSpan.Zero
                };
            });

        services.AddScoped<IIdentityService, IdentityService>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<IImageUploadService, CloudinaryImageUploadService>();
        services.AddScoped<IEmailService, MailKitEmailService>();
        services.AddHostedService<OutboxProcessor>();

        return services;
    }
}
