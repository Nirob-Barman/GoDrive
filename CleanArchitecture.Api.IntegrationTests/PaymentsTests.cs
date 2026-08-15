using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using FluentAssertions;

namespace CleanArchitecture.Api.IntegrationTests;

public class PaymentsTests : IntegrationTestBase
{
    public PaymentsTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    private async Task<(HttpClient AdminClient, HttpClient CustomerClient, int ReservationId)>
        SetupApprovedReservationAsync(string customerEmail)
    {
        var adminClient = AuthorizedClient(await LoginAsAdminAsync());
        var customerClient = AuthorizedClient(await RegisterAndLoginAsync(customerEmail));

        await customerClient.PutAsync(
            "/api/users/me",
            new MultipartFormDataContent
            {
                { new StringContent("Payment Tester"), "fullName" },
                { new StringContent("NID555"), "nIDOrPassportNumber" },
                { new StringContent("DL555"), "drivingLicenseNumber" }
            });

        var carResponse = await adminClient.PostAsJsonAsync("/api/admin/cars", new
        {
            name = "Payment Test Car",
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

        return (adminClient, customerClient, reservationId);
    }

    [Fact]
    public async Task Checkout_session_can_be_created_for_an_approved_reservation()
    {
        var (_, customerClient, reservationId) = await SetupApprovedReservationAsync("checkout@test.com");

        var response = await customerClient.PostAsync($"/api/payments/checkout/{reservationId}", null);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await ReadDataAsync<JsonElement>(response);
        result.GetProperty("sessionId").GetString().Should().NotBeNullOrWhiteSpace();
        result.GetProperty("checkoutUrl").GetString().Should().NotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task Webhook_with_invalid_signature_is_rejected()
    {
        var payload = """{"id":"evt_bad","object":"event","type":"checkout.session.completed","data":{"object":{"id":"cs_bad"}}}""";

        var request = new HttpRequestMessage(HttpMethod.Post, "/api/payments/webhook")
        {
            Content = new StringContent(payload, Encoding.UTF8, "application/json")
        };
        request.Headers.Add("Stripe-Signature", "t=1,v1=deadbeef");

        var response = await Client.SendAsync(request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Valid_webhook_marks_payment_paid_and_unblocks_pickup()
    {
        var (adminClient, customerClient, reservationId) = await SetupApprovedReservationAsync("webhookpay@test.com");

        await CompleteReservationPaymentAsync(customerClient, reservationId);

        var pickupResponse = await adminClient.PutAsync($"/api/admin/reservations/{reservationId}/pickup", null);
        pickupResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var myPayments = await customerClient.GetAsync("/api/payments");
        myPayments.StatusCode.Should().Be(HttpStatusCode.OK);
        var page = await ReadDataAsync<JsonElement>(myPayments);
        page.GetProperty("items").EnumerateArray().Should().ContainSingle();
    }

    [Fact]
    public async Task Admin_can_list_all_payments()
    {
        var (_, customerClient, reservationId) = await SetupApprovedReservationAsync("adminpay@test.com");
        var adminClient = AuthorizedClient(await LoginAsAdminAsync());
        await CompleteReservationPaymentAsync(customerClient, reservationId);

        var response = await adminClient.GetAsync("/api/admin/payments");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
