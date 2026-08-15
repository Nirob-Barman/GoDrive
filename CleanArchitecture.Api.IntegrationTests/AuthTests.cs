using System.Net;
using System.Net.Http.Json;
using FluentAssertions;

namespace CleanArchitecture.Api.IntegrationTests;

public class AuthTests : IntegrationTestBase
{
    public AuthTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task Register_then_login_succeeds()
    {
        var token = await RegisterAndLoginAsync("newcustomer@test.com");

        token.Should().NotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task Register_with_duplicate_email_returns_conflict()
    {
        await RegisterAndLoginAsync("dupe@test.com");

        var response = await Client.PostAsJsonAsync("/api/auth/register", new
        {
            fullName = "Second Try",
            email = "dupe@test.com",
            password = "Passw0rd!",
            confirmPassword = "Passw0rd!",
            phoneNumber = (string?)null,
            termsAccepted = true
        });

        response.StatusCode.Should().Be(HttpStatusCode.Conflict);
    }

    [Fact]
    public async Task Login_with_wrong_password_returns_unauthorized()
    {
        await RegisterAndLoginAsync("wrongpass@test.com", password: "Correct1!");

        var response = await Client.PostAsJsonAsync("/api/auth/login", new
        {
            email = "wrongpass@test.com",
            password = "Incorrect1!"
        });

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Seeded_admin_can_log_in_and_access_admin_only_endpoints()
    {
        var adminToken = await LoginAsAdminAsync();
        var adminClient = AuthorizedClient(adminToken);

        var response = await adminClient.GetAsync("/api/admin/users");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Non_admin_is_denied_admin_only_endpoints()
    {
        var userToken = await RegisterAndLoginAsync("plainuser@test.com");
        var userClient = AuthorizedClient(userToken);

        var response = await userClient.GetAsync("/api/admin/users");

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
}
