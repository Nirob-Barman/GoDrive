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

    [Fact]
    public async Task Car_utilization_reflects_an_approved_reservations_hours_and_zero_for_an_unused_car()
    {
        var adminClient = AuthorizedClient(await LoginAsAdminAsync());
        var customerClient = AuthorizedClient(await RegisterAndLoginAsync("utilcustomer@test.com"));

        await customerClient.PutAsync(
            "/api/users/me",
            new MultipartFormDataContent
            {
                { new StringContent("Utilization Customer"), "fullName" },
                { new StringContent("NID888"), "nIDOrPassportNumber" },
                { new StringContent("DL888"), "drivingLicenseNumber" }
            });

        var usedCarResponse = await adminClient.PostAsJsonAsync("/api/admin/cars", new
        {
            name = "Used Car",
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
        var usedCarId = (await ReadDataAsync<JsonElement>(usedCarResponse)).GetProperty("id").GetInt32();

        var idleCarResponse = await adminClient.PostAsJsonAsync("/api/admin/cars", new
        {
            name = "Idle Car",
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
        var idleCarId = (await ReadDataAsync<JsonElement>(idleCarResponse)).GetProperty("id").GetInt32();

        var pickup = DateTime.UtcNow.AddHours(1);
        var dropoff = pickup.AddHours(10);
        var reservationResponse = await customerClient.PostAsJsonAsync("/api/reservations", new
        {
            carId = usedCarId,
            pickupDate = pickup,
            dropoffDate = dropoff
        });
        var reservationId = (await ReadDataAsync<JsonElement>(reservationResponse)).GetProperty("id").GetInt32();
        await adminClient.PutAsync($"/api/admin/reservations/{reservationId}/approve", null);

        var response = await adminClient.GetAsync(
            $"/api/admin/dashboard/car-utilization?startDate={DateTime.UtcNow.AddDays(-1):O}&endDate={DateTime.UtcNow.AddDays(2):O}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var items = (await ReadDataAsync<JsonElement>(response)).EnumerateArray().ToList();

        var usedCarStats = items.Single(i => i.GetProperty("carId").GetInt32() == usedCarId);
        usedCarStats.GetProperty("confirmedBookings").GetInt32().Should().Be(1);
        usedCarStats.GetProperty("bookedHours").GetInt32().Should().Be(10);
        usedCarStats.GetProperty("utilizationRatePercent").GetDecimal().Should().BeGreaterThan(0);

        var idleCarStats = items.Single(i => i.GetProperty("carId").GetInt32() == idleCarId);
        idleCarStats.GetProperty("confirmedBookings").GetInt32().Should().Be(0);
        idleCarStats.GetProperty("bookedHours").GetInt32().Should().Be(0);
        idleCarStats.GetProperty("utilizationRatePercent").GetDecimal().Should().Be(0);
    }
}
