using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;

namespace CleanArchitecture.Api.IntegrationTests;

public class AuthCookieTests : IntegrationTestBase
{
    public AuthCookieTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    private static string ExtractCookieValue(HttpResponseMessage response, string cookieName)
    {
        response.Headers.TryGetValues("Set-Cookie", out var cookies).Should().BeTrue();
        var cookie = cookies!.Single(c => c.StartsWith($"{cookieName}="));
        var nameValue = cookie.Split(';')[0];
        return nameValue[(cookieName.Length + 1)..];
    }

    private async Task RegisterAsync(HttpClient client, string email, string password = "Passw0rd!")
    {
        var response = await client.PostAsJsonAsync("/api/auth/register", new
        {
            fullName = "Cookie Test",
            email,
            password,
            confirmPassword = password,
            phoneNumber = (string?)null,
            termsAccepted = true
        });
        response.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task Login_sets_an_httponly_refresh_cookie_and_the_body_omits_it()
    {
        var client = ClientWithoutCookieHandling();
        var email = "cookie-login@test.com";
        await RegisterAsync(client, email);

        var response = await client.PostAsJsonAsync("/api/auth/login", new { email, password = "Passw0rd!" });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        response.Headers.TryGetValues("Set-Cookie", out var cookies).Should().BeTrue();
        var refreshCookie = cookies!.Single(c => c.StartsWith("refreshToken="));
        refreshCookie.ToLowerInvariant().Should().Contain("httponly").And.Contain("samesite=none").And.Contain("secure");

        var body = await response.Content.ReadAsStringAsync();
        body.Should().NotContain("refreshToken");
    }

    [Fact]
    public async Task Refresh_token_rotates_via_cookie_with_no_body_and_the_old_cookie_is_rejected_after_rotation()
    {
        var client = ClientWithoutCookieHandling();
        var email = "cookie-refresh@test.com";
        await RegisterAsync(client, email);

        var loginResponse = await client.PostAsJsonAsync("/api/auth/login", new { email, password = "Passw0rd!" });
        var originalCookieValue = ExtractCookieValue(loginResponse, "refreshToken");

        var firstRefreshRequest = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh-token");
        firstRefreshRequest.Headers.Add("Cookie", $"refreshToken={originalCookieValue}");
        var firstRefreshResponse = await client.SendAsync(firstRefreshRequest);

        firstRefreshResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var firstRefreshBody = await firstRefreshResponse.Content.ReadAsStringAsync();
        firstRefreshBody.Should().NotContain("refreshToken");
        var rotatedCookieValue = ExtractCookieValue(firstRefreshResponse, "refreshToken");
        rotatedCookieValue.Should().NotBe(originalCookieValue);

        var replayRequest = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh-token");
        replayRequest.Headers.Add("Cookie", $"refreshToken={originalCookieValue}");
        var replayResponse = await client.SendAsync(replayRequest);
        replayResponse.StatusCode.Should().Be(HttpStatusCode.Unauthorized);

        var rotatedWorksRequest = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh-token");
        rotatedWorksRequest.Headers.Add("Cookie", $"refreshToken={rotatedCookieValue}");
        var rotatedWorksResponse = await client.SendAsync(rotatedWorksRequest);
        rotatedWorksResponse.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Refresh_token_without_any_cookie_returns_unauthorized()
    {
        var client = ClientWithoutCookieHandling();

        var response = await client.PostAsync("/api/auth/refresh-token", null);

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Change_password_spares_the_calling_sessions_own_refresh_token_but_revokes_other_sessions()
    {
        var client = ClientWithoutCookieHandling();
        var email = "cookie-changepw@test.com";
        await RegisterAsync(client, email);

        // Two logins simulate two devices/sessions - each gets its own refresh-token cookie.
        var firstLoginResponse = await client.PostAsJsonAsync("/api/auth/login", new { email, password = "Passw0rd!" });
        var firstLoginJson = await ReadDataAsync<JsonElement>(firstLoginResponse);
        var firstAccessToken = firstLoginJson.GetProperty("token").GetString();
        var firstRefreshCookie = ExtractCookieValue(firstLoginResponse, "refreshToken");

        var secondLoginResponse = await client.PostAsJsonAsync("/api/auth/login", new { email, password = "Passw0rd!" });
        var secondRefreshCookie = ExtractCookieValue(secondLoginResponse, "refreshToken");

        // Change password from the FIRST session (its access token + its own refresh cookie attached).
        var changePasswordRequest = new HttpRequestMessage(HttpMethod.Post, "/api/auth/change-password")
        {
            Content = JsonContent.Create(new
            {
                currentPassword = "Passw0rd!",
                newPassword = "NewPassw0rd!",
                confirmNewPassword = "NewPassw0rd!",
            }),
        };
        changePasswordRequest.Headers.Add("Cookie", $"refreshToken={firstRefreshCookie}");
        changePasswordRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", firstAccessToken);
        var changePasswordResponse = await client.SendAsync(changePasswordRequest);
        changePasswordResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        // The FIRST session's own refresh token still works.
        var firstRefreshRequest = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh-token");
        firstRefreshRequest.Headers.Add("Cookie", $"refreshToken={firstRefreshCookie}");
        var firstRefreshResponse = await client.SendAsync(firstRefreshRequest);
        firstRefreshResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        // The SECOND session's refresh token was revoked.
        var secondRefreshRequest = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh-token");
        secondRefreshRequest.Headers.Add("Cookie", $"refreshToken={secondRefreshCookie}");
        var secondRefreshResponse = await client.SendAsync(secondRefreshRequest);
        secondRefreshResponse.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Logout_revokes_the_cookie_and_a_subsequent_refresh_is_rejected()
    {
        var client = ClientWithoutCookieHandling();
        var email = "cookie-logout@test.com";
        await RegisterAsync(client, email);

        var loginResponse = await client.PostAsJsonAsync("/api/auth/login", new { email, password = "Passw0rd!" });
        var cookieValue = ExtractCookieValue(loginResponse, "refreshToken");

        var logoutRequest = new HttpRequestMessage(HttpMethod.Post, "/api/auth/logout");
        logoutRequest.Headers.Add("Cookie", $"refreshToken={cookieValue}");
        var logoutResponse = await client.SendAsync(logoutRequest);
        logoutResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var refreshRequest = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh-token");
        refreshRequest.Headers.Add("Cookie", $"refreshToken={cookieValue}");
        var refreshResponse = await client.SendAsync(refreshRequest);
        refreshResponse.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
