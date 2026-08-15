using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Models;
using CleanArchitecture.Infrastructure.Persistence;
using CleanArchitecture.Infrastructure.Persistence.Seed;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using NSubstitute;
using Respawn;

namespace CleanArchitecture.Api.IntegrationTests;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    public const string TestConnectionString =
        @"Server=WINDOWS\SQLEXPRESS;Database=GoDriveTestDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True";

    // Fixed, test-only values - never depend on whatever happens to be in a developer's local .env,
    // so `dotnet test` is reproducible on a fresh clone with no manual setup step.
    public const string TestWebhookSecret = "whsec_test_fixed_for_integration_tests";
    public const string AdminEmail = "admin@integrationtests.local";
    public const string AdminPassword = "IntegrationTest#Admin1";

    private Respawner _respawner = null!;
    private SqlConnection _respawnConnection = null!;

    public CustomWebApplicationFactory()
    {
        // The refresh-token cookie is Secure, so HttpClient's cookie container only resends it on
        // https requests - the in-memory TestServer never does real TLS, but treating the client's
        // BaseAddress as https is enough for cookie handling to behave like a real browser would.
        ClientOptions.BaseAddress = new Uri("https://localhost");
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureAppConfiguration((_, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:DefaultConnection"] = TestConnectionString,
                ["Stripe:WebhookSecret"] = TestWebhookSecret,
                ["SeedAdmin:Email"] = AdminEmail,
                ["SeedAdmin:Password"] = AdminPassword,
                ["SeedAdmin:FullName"] = "Integration Test Admin"
            });
        });

        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll<IEmailService>();
            var fakeEmailService = Substitute.For<IEmailService>();
            fakeEmailService
                .SendAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>())
                .Returns(Task.CompletedTask);
            services.AddSingleton(fakeEmailService);

            services.RemoveAll<IImageUploadService>();
            var fakeImageUploadService = Substitute.For<IImageUploadService>();
            fakeImageUploadService
                .UploadAsync(Arg.Any<Stream>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>())
                .Returns(Task.FromResult(new UploadedImage("https://fake.test/image.jpg", "fake-public-id")));
            services.AddSingleton(fakeImageUploadService);

            services.RemoveAll<IPaymentService>();
            services.AddScoped<IPaymentService, TestPaymentService>();
        });
    }

    public async Task InitializeAsync()
    {
        using var scope = Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await context.Database.MigrateAsync();

        // The app's own startup seeding (Program.cs) runs before migrations exist on a brand-new test
        // DB and fails silently there (caught + logged) - re-run it now that the schema is guaranteed.
        await IdentitySeeder.SeedAsync(scope.ServiceProvider);

        _respawnConnection = new SqlConnection(TestConnectionString);
        await _respawnConnection.OpenAsync();

        _respawner = await Respawner.CreateAsync(_respawnConnection, new RespawnerOptions
        {
            DbAdapter = DbAdapter.SqlServer,
            TablesToIgnore = new Respawn.Graph.Table[] { "__EFMigrationsHistory" }
        });
    }

    public async Task ResetDatabaseAsync()
    {
        await _respawner.ResetAsync(_respawnConnection);

        // Respawn wipes AspNetRoles/AspNetUsers too - reseed so every test starts with a working admin.
        using var scope = Services.CreateScope();
        await IdentitySeeder.SeedAsync(scope.ServiceProvider);
    }

    async Task IAsyncLifetime.DisposeAsync()
    {
        if (_respawnConnection is not null)
        {
            await _respawnConnection.DisposeAsync();
        }
    }
}
