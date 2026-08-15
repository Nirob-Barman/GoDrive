using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;

namespace CleanArchitecture.Api.IntegrationTests;

public class ReservationsTests : IntegrationTestBase
{
    public ReservationsTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    private async Task<(HttpClient AdminClient, HttpClient CustomerClient, int CarId)> SetupCarAndCustomerAsync(
        string customerEmail)
    {
        var adminClient = AuthorizedClient(await LoginAsAdminAsync());
        var customerToken = await RegisterAndLoginAsync(customerEmail);
        var customerClient = AuthorizedClient(customerToken);

        await customerClient.PutAsync(
            "/api/users/me",
            new MultipartFormDataContent
            {
                { new StringContent("Reservation Tester"), "fullName" },
                { new StringContent("NID123"), "nIDOrPassportNumber" },
                { new StringContent("DL123"), "drivingLicenseNumber" }
            });

        var carResponse = await adminClient.PostAsJsonAsync("/api/admin/cars", new
        {
            name = "Reservation Test Car",
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
        var car = await ReadDataAsync<JsonElement>(carResponse);
        var carId = car.GetProperty("id").GetInt32();

        return (adminClient, customerClient, carId);
    }

    private static object ReservationPayload(int carId, DateTime pickup, DateTime dropoff) => new
    {
        carId,
        pickupDate = pickup,
        dropoffDate = dropoff
    };

    [Fact]
    public async Task Create_reservation_without_id_documents_is_rejected()
    {
        var adminClient = AuthorizedClient(await LoginAsAdminAsync());
        var customerClient = AuthorizedClient(await RegisterAndLoginAsync("nodocs@test.com"));

        var carResponse = await adminClient.PostAsJsonAsync("/api/admin/cars", new
        {
            name = "No Docs Car",
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

        var response = await customerClient.PostAsJsonAsync(
            "/api/reservations",
            ReservationPayload(carId, DateTime.UtcNow.AddDays(1), DateTime.UtcNow.AddDays(2)));

        response.StatusCode.Should().Be(HttpStatusCode.UnprocessableEntity);
    }

    [Fact]
    public async Task Overlapping_reservation_on_the_same_car_is_rejected()
    {
        var (_, customerClient, carId) = await SetupCarAndCustomerAsync("overlap@test.com");
        var pickup = DateTime.UtcNow.AddDays(1);
        var dropoff = DateTime.UtcNow.AddDays(2);

        var first = await customerClient.PostAsJsonAsync("/api/reservations", ReservationPayload(carId, pickup, dropoff));
        first.StatusCode.Should().Be(HttpStatusCode.Created);

        var overlapping = await customerClient.PostAsJsonAsync(
            "/api/reservations",
            ReservationPayload(carId, pickup.AddHours(6), dropoff.AddDays(1)));

        overlapping.StatusCode.Should().Be(HttpStatusCode.Conflict);
    }

    [Fact]
    public async Task Cancel_succeeds_while_pending_but_is_rejected_once_approved()
    {
        var (adminClient, customerClient, carId) = await SetupCarAndCustomerAsync("cancelrules@test.com");

        var pendingResponse = await customerClient.PostAsJsonAsync(
            "/api/reservations",
            ReservationPayload(carId, DateTime.UtcNow.AddDays(1), DateTime.UtcNow.AddDays(2)));
        var pendingId = (await ReadDataAsync<JsonElement>(pendingResponse)).GetProperty("id").GetInt32();

        var cancelPending = await customerClient.PutAsync($"/api/reservations/{pendingId}/cancel", null);
        cancelPending.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var secondResponse = await customerClient.PostAsJsonAsync(
            "/api/reservations",
            ReservationPayload(carId, DateTime.UtcNow.AddDays(5), DateTime.UtcNow.AddDays(6)));
        var secondId = (await ReadDataAsync<JsonElement>(secondResponse)).GetProperty("id").GetInt32();
        await adminClient.PutAsync($"/api/admin/reservations/{secondId}/approve", null);

        var cancelApproved = await customerClient.PutAsync($"/api/reservations/{secondId}/cancel", null);
        cancelApproved.StatusCode.Should().Be(HttpStatusCode.Conflict);
    }

    [Fact]
    public async Task Pickup_is_blocked_until_payment_succeeds()
    {
        var (adminClient, customerClient, carId) = await SetupCarAndCustomerAsync("paymentgate@test.com");

        var reservationResponse = await customerClient.PostAsJsonAsync(
            "/api/reservations",
            ReservationPayload(carId, DateTime.UtcNow.AddDays(1), DateTime.UtcNow.AddDays(2)));
        var reservationId = (await ReadDataAsync<JsonElement>(reservationResponse)).GetProperty("id").GetInt32();

        await adminClient.PutAsync($"/api/admin/reservations/{reservationId}/approve", null);

        var pickupBeforePayment = await adminClient.PutAsync($"/api/admin/reservations/{reservationId}/pickup", null);
        pickupBeforePayment.StatusCode.Should().Be(HttpStatusCode.Conflict);
    }
}
