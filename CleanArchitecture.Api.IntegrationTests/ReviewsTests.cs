using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;

namespace CleanArchitecture.Api.IntegrationTests;

public class ReviewsTests : IntegrationTestBase
{
    public ReviewsTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    private async Task<(HttpClient AdminClient, HttpClient CustomerClient, int CarId, int ReservationId)>
        SetupReturnedReservationAsync(string customerEmail)
    {
        var adminClient = AuthorizedClient(await LoginAsAdminAsync());
        var customerToken = await RegisterAndLoginAsync(customerEmail);
        var customerClient = AuthorizedClient(customerToken);

        await customerClient.PutAsync(
            "/api/users/me",
            new MultipartFormDataContent
            {
                { new StringContent("Review Tester"), "fullName" },
                { new StringContent("NID999"), "nIDOrPassportNumber" },
                { new StringContent("DL999"), "drivingLicenseNumber" }
            });

        var carResponse = await adminClient.PostAsJsonAsync("/api/admin/cars", new
        {
            name = "Review Test Car",
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

        var reservationResponse = await customerClient.PostAsJsonAsync("/api/reservations", new
        {
            carId,
            pickupDate = DateTime.UtcNow.AddDays(1),
            dropoffDate = DateTime.UtcNow.AddDays(2)
        });
        var reservationId = (await ReadDataAsync<JsonElement>(reservationResponse)).GetProperty("id").GetInt32();

        await adminClient.PutAsync($"/api/admin/reservations/{reservationId}/approve", null);
        await CompleteReservationPaymentAsync(customerClient, reservationId);
        await adminClient.PutAsync($"/api/admin/reservations/{reservationId}/pickup", null);
        await adminClient.PutAsync($"/api/admin/reservations/{reservationId}/return", null);

        return (adminClient, customerClient, carId, reservationId);
    }

    [Fact]
    public async Task Review_requires_a_returned_reservation_for_that_car()
    {
        var customerClient = AuthorizedClient(await RegisterAndLoginAsync("noreview@test.com"));
        var adminClient = AuthorizedClient(await LoginAsAdminAsync());

        var carResponse = await adminClient.PostAsJsonAsync("/api/admin/cars", new
        {
            name = "Unrented Car",
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
            $"/api/cars/{carId}/reviews", new { rating = 5, comment = "Great!" });

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task Review_succeeds_after_a_full_returned_lifecycle_and_a_second_review_is_rejected()
    {
        var (_, customerClient, carId, _) = await SetupReturnedReservationAsync("reviewer@test.com");

        var createResponse = await customerClient.PostAsJsonAsync(
            $"/api/cars/{carId}/reviews", new { rating = 5, comment = "Great car!" });
        createResponse.StatusCode.Should().Be(HttpStatusCode.Created);

        var duplicateResponse = await customerClient.PostAsJsonAsync(
            $"/api/cars/{carId}/reviews", new { rating = 4, comment = "Again" });
        duplicateResponse.StatusCode.Should().Be(HttpStatusCode.Conflict);

        var listResponse = await Client.GetAsync($"/api/cars/{carId}/reviews?pageNumber=1&pageSize=10");
        listResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var page = await ReadDataAsync<JsonElement>(listResponse);
        page.GetProperty("items").EnumerateArray().Should().ContainSingle();
    }

    [Fact]
    public async Task Only_the_review_owner_can_update_or_delete_it()
    {
        var (_, customerClient, carId, _) = await SetupReturnedReservationAsync("owner@test.com");
        var createResponse = await customerClient.PostAsJsonAsync(
            $"/api/cars/{carId}/reviews", new { rating = 3, comment = "Okay" });
        var reviewId = (await ReadDataAsync<JsonElement>(createResponse)).GetProperty("id").GetInt32();

        var otherClient = AuthorizedClient(await RegisterAndLoginAsync("notowner@test.com"));

        var updateResponse = await otherClient.PutAsJsonAsync(
            $"/api/reviews/{reviewId}", new { rating = 1, comment = "Hijacked" });
        updateResponse.StatusCode.Should().Be(HttpStatusCode.Forbidden);

        var deleteResponse = await otherClient.DeleteAsync($"/api/reviews/{reviewId}");
        deleteResponse.StatusCode.Should().Be(HttpStatusCode.Forbidden);

        var ownUpdateResponse = await customerClient.PutAsJsonAsync(
            $"/api/reviews/{reviewId}", new { rating = 4, comment = "Updated" });
        ownUpdateResponse.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
