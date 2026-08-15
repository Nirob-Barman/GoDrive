using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;

namespace CleanArchitecture.Api.IntegrationTests;

public class DashboardTests : IntegrationTestBase
{
    public DashboardTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task Non_admin_cannot_access_dashboard_statistics()
    {
        var userClient = AuthorizedClient(await RegisterAndLoginAsync("nodash@test.com"));

        var response = await userClient.GetAsync("/api/admin/dashboard/statistics");

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task Admin_sees_dashboard_statistics_reflecting_a_new_car_and_reservation()
    {
        var adminClient = AuthorizedClient(await LoginAsAdminAsync());
        var customerClient = AuthorizedClient(await RegisterAndLoginAsync("dashcustomer@test.com"));

        await customerClient.PutAsync(
            "/api/users/me",
            new MultipartFormDataContent
            {
                { new StringContent("Dashboard Customer"), "fullName" },
                { new StringContent("NID777"), "nIDOrPassportNumber" },
                { new StringContent("DL777"), "drivingLicenseNumber" }
            });

        var carResponse = await adminClient.PostAsJsonAsync("/api/admin/cars", new
        {
            name = "Dashboard Car",
            brand = "Toyota",
            model = "Corolla",
            year = 2023,
            description = "A car",
            carType = "Sedan",
            fuelType = "Petrol",
            transmission = "Automatic",
            seats = 5,
            pricePerHour = 10m,
            location = "Dhaka"
        });
        var carId = (await ReadDataAsync<JsonElement>(carResponse)).GetProperty("id").GetInt32();

        await customerClient.PostAsJsonAsync("/api/reservations", new
        {
            carId,
            pickupDate = DateTime.UtcNow.AddDays(1),
            dropoffDate = DateTime.UtcNow.AddDays(2)
        });

        var response = await adminClient.GetAsync("/api/admin/dashboard/statistics");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var stats = await ReadDataAsync<JsonElement>(response);
        stats.GetProperty("totalCars").GetInt32().Should().BeGreaterThanOrEqualTo(1);
        stats.GetProperty("pendingReservations").GetInt32().Should().BeGreaterThanOrEqualTo(1);
    }

    [Fact]
    public async Task Revenue_endpoint_returns_ok_for_admin()
    {
        var adminClient = AuthorizedClient(await LoginAsAdminAsync());

        var response = await adminClient.GetAsync(
            $"/api/admin/dashboard/revenue?period=Daily&startDate={DateTime.UtcNow.AddDays(-7):O}&endDate={DateTime.UtcNow:O}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
