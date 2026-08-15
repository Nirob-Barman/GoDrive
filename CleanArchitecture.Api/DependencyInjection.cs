using System.Text.Json.Serialization;
using CleanArchitecture.Api.Common;
using CleanArchitecture.Api.Middleware;
using CleanArchitecture.Api.Services;
using CleanArchitecture.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.OpenApi.Models;

namespace CleanArchitecture.Api;

public static class DependencyInjection
{
    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddControllers()
            .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
        services.AddEndpointsApiExplorer();

        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddAuthorization();

        // The React client's origin - not a secret, but read from .env (CORS__ALLOWEDORIGIN) rather than
        // appsettings.json since that file is fully git-ignored in this repo with no committed template.
        // AllowCredentials is required so the browser sends/receives the httpOnly refresh-token cookie;
        // it cannot be combined with AllowAnyOrigin, which is why a single explicit origin is required here.
        var allowedOrigin = configuration["Cors:AllowedOrigin"] ?? "http://localhost:5173";
        services.AddCors(options => options.AddPolicy(CorsPolicies.WebClient, policy => policy
            .WithOrigins(allowedOrigin)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()));

        services.AddExceptionHandler<GlobalExceptionHandler>();
        services.AddProblemDetails();

        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "GoDrive API", Version = "v1" });

            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Enter 'Bearer' followed by a space and your JWT, e.g. \"Bearer eyJhbGci...\""
            });

            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                    },
                    Array.Empty<string>()
                }
            });
        });

        return services;
    }
}
