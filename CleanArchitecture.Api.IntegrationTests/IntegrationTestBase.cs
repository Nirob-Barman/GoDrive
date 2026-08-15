using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace CleanArchitecture.Api.IntegrationTests;

[Collection(nameof(IntegrationTestCollection))]
public abstract class IntegrationTestBase : IAsyncLifetime
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly CustomWebApplicationFactory _factory;
    protected readonly HttpClient Client;

    protected IntegrationTestBase(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        Client = factory.CreateClient();
    }

    // xUnit constructs a fresh instance of the test class per test method, so resetting here
    // gives every test a clean database without needing to spin up a new host each time.
    public Task InitializeAsync() => _factory.ResetDatabaseAsync();

    public Task DisposeAsync() => Task.CompletedTask;

    protected async Task<string> RegisterAndLoginAsync(
        string email, string password = "Passw0rd!", string fullName = "Test User")
    {
        var registerResponse = await Client.PostAsJsonAsync("/api/auth/register", new
        {
            fullName,
            email,
            password,
            confirmPassword = password,
            phoneNumber = (string?)null,
            termsAccepted = true
        });
        registerResponse.EnsureSuccessStatusCode();

        return await LoginAsync(email, password);
    }

    protected async Task<string> LoginAsync(string email, string password)
    {
        var response = await Client.PostAsJsonAsync("/api/auth/login", new { email, password });
        response.EnsureSuccessStatusCode();

        return (await ReadDataAsync<JsonElement>(response)).GetProperty("token").GetString()!;
    }

    protected Task<string> LoginAsAdminAsync() =>
        LoginAsync(CustomWebApplicationFactory.AdminEmail, CustomWebApplicationFactory.AdminPassword);

    protected HttpClient AuthorizedClient(string token)
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return client;
    }

    // For tests that need to inspect/replay the raw refresh-token cookie value directly -
    // a client with its own automatic cookie handling would hide the Set-Cookie value from us.
    protected HttpClient ClientWithoutCookieHandling() =>
        _factory.CreateClient(new Microsoft.AspNetCore.Mvc.Testing.WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost"),
            HandleCookies = false,
        });

    protected static async Task<T> ReadDataAsync<T>(HttpResponseMessage response)
    {
        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        return json.GetProperty("data").Deserialize<T>(JsonOptions)!;
    }

    // Completes payment for an Approved reservation exactly as Stripe's real webhook delivery would:
    // create a checkout session (faked, no real Stripe call), then sign and deliver a synthetic
    // checkout.session.completed event through the real signature-verification code path.
    protected async Task CompleteReservationPaymentAsync(HttpClient customerClient, int reservationId)
    {
        var checkoutResponse = await customerClient.PostAsync($"/api/payments/checkout/{reservationId}", null);
        checkoutResponse.EnsureSuccessStatusCode();
        var sessionId = (await ReadDataAsync<JsonElement>(checkoutResponse)).GetProperty("sessionId").GetString()!;

        var payload =
            "{\"id\":\"evt_test_" + reservationId + "\",\"object\":\"event\",\"type\":\"checkout.session.completed\"," +
            "\"data\":{\"object\":{\"id\":\"" + sessionId + "\",\"object\":\"checkout.session\"," +
            "\"payment_intent\":\"pi_test_" + reservationId + "\"," +
            "\"metadata\":{\"reservationId\":\"" + reservationId + "\"}}}}";

        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var signedPayload = $"{timestamp}.{payload}";
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(CustomWebApplicationFactory.TestWebhookSecret));
        var signature = Convert.ToHexString(hmac.ComputeHash(Encoding.UTF8.GetBytes(signedPayload))).ToLowerInvariant();

        var request = new HttpRequestMessage(HttpMethod.Post, "/api/payments/webhook")
        {
            Content = new StringContent(payload, Encoding.UTF8, "application/json")
        };
        request.Headers.Add("Stripe-Signature", $"t={timestamp},v1={signature}");

        var webhookResponse = await Client.SendAsync(request);
        webhookResponse.EnsureSuccessStatusCode();
    }
}
