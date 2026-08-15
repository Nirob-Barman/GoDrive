using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;

namespace CleanArchitecture.Api.IntegrationTests;

public class AdminUsersTests : IntegrationTestBase
{
    public AdminUsersTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task Non_admin_cannot_access_admin_user_endpoints()
    {
        var userClient = AuthorizedClient(await RegisterAndLoginAsync("plainlist@test.com"));

        var response = await userClient.GetAsync("/api/admin/users");

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task Admin_can_deactivate_a_user_and_the_user_is_blocked_from_protected_endpoints()
    {
        var adminClient = AuthorizedClient(await LoginAsAdminAsync());
        var userToken = await RegisterAndLoginAsync("blockme@test.com");
        var userClient = AuthorizedClient(userToken);

        var listResponse = await adminClient.GetAsync("/api/admin/users?search=blockme@test.com");
        var page = await ReadDataAsync<JsonElement>(listResponse);
        var userId = page.GetProperty("items").EnumerateArray().First().GetProperty("userId").GetString();

        var deactivateResponse = await adminClient.PutAsJsonAsync(
            $"/api/admin/users/{userId}/status", new { isActive = false });
        deactivateResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var refreshResponse = await userClient.PostAsJsonAsync("/api/auth/login", new
        {
            email = "blockme@test.com",
            password = "Passw0rd!"
        });
        refreshResponse.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Admin_can_change_a_users_role_but_cannot_change_their_own_role()
    {
        var adminClient = AuthorizedClient(await LoginAsAdminAsync());
        await RegisterAndLoginAsync("promoteme@test.com");

        var listResponse = await adminClient.GetAsync("/api/admin/users?search=promoteme@test.com");
        var page = await ReadDataAsync<JsonElement>(listResponse);
        var userId = page.GetProperty("items").EnumerateArray().First().GetProperty("userId").GetString();

        var promoteResponse = await adminClient.PutAsJsonAsync(
            $"/api/admin/users/{userId}/role", new { role = "Admin" });
        promoteResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var adminUserResponse = await adminClient.GetAsync("/api/admin/users?search=admin@integrationtests.local");
        var adminPage = await ReadDataAsync<JsonElement>(adminUserResponse);
        var adminUserId = adminPage.GetProperty("items").EnumerateArray().First().GetProperty("userId").GetString();

        var selfDemoteResponse = await adminClient.PutAsJsonAsync(
            $"/api/admin/users/{adminUserId}/role", new { role = "User" });
        selfDemoteResponse.StatusCode.Should().Be(HttpStatusCode.Conflict);
    }
}
