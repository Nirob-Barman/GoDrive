using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;

namespace CleanArchitecture.Api.IntegrationTests;

public class CarsTests : IntegrationTestBase
{
    public CarsTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    private static object NewCarPayload(string name = "Test Car", decimal pricePerHour = 10m, string carType = "Sedan") => new
    {
        name,
        brand = "Toyota",
        model = "Corolla",
        year = 2023,
        description = "A car",
        carType,
        fuelType = "Petrol",
        transmission = "Automatic",
        seats = 5,
        pricePerHour,
        location = "Dhaka"
    };

    [Fact]
    public async Task Non_admin_cannot_create_a_car()
    {
        var userToken = await RegisterAndLoginAsync("carcustomer@test.com");
        var userClient = AuthorizedClient(userToken);

        var response = await userClient.PostAsJsonAsync("/api/admin/cars", NewCarPayload());

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task Admin_can_create_update_and_delete_a_car()
    {
        var adminClient = AuthorizedClient(await LoginAsAdminAsync());

        var createResponse = await adminClient.PostAsJsonAsync("/api/admin/cars", NewCarPayload("Create Test Car"));
        createResponse.StatusCode.Should().Be(HttpStatusCode.Created);
        var created = await ReadDataAsync<JsonElement>(createResponse);
        var carId = created.GetProperty("id").GetInt32();

        var updateResponse = await adminClient.PutAsJsonAsync($"/api/admin/cars/{carId}", new
        {
            name = "Updated Name",
            brand = "Toyota",
            model = "Corolla",
            year = 2023,
            description = "Updated",
            carType = "Sedan",
            fuelType = "Petrol",
            transmission = "Automatic",
            seats = 5,
            pricePerHour = 15m,
            location = "Dhaka",
            status = "Active"
        });
        updateResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        (await ReadDataAsync<JsonElement>(updateResponse)).GetProperty("name").GetString().Should().Be("Updated Name");

        var deleteResponse = await adminClient.DeleteAsync($"/api/admin/cars/{carId}");
        deleteResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var getResponse = await Client.GetAsync($"/api/cars/{carId}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Public_search_filters_by_car_type()
    {
        var adminClient = AuthorizedClient(await LoginAsAdminAsync());
        await adminClient.PostAsJsonAsync("/api/admin/cars", NewCarPayload("Sedan One", carType: "Sedan"));
        await adminClient.PostAsJsonAsync("/api/admin/cars", NewCarPayload("SUV One", carType: "SUV"));

        var response = await Client.GetAsync("/api/cars?carType=SUV");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await ReadDataAsync<JsonElement>(response);
        var items = result.GetProperty("items").EnumerateArray().ToList();
        items.Should().ContainSingle();
        items[0].GetProperty("name").GetString().Should().Be("SUV One");
    }

    [Fact]
    public async Task Get_car_by_id_returns_not_found_for_missing_car()
    {
        var response = await Client.GetAsync("/api/cars/999999");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Non_admin_cannot_list_all_cars()
    {
        var userToken = await RegisterAndLoginAsync("adminlistcustomer@test.com");
        var userClient = AuthorizedClient(userToken);

        var response = await userClient.GetAsync("/api/admin/cars");

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task Admin_car_listing_includes_inactive_cars_unlike_the_public_listing()
    {
        var adminClient = AuthorizedClient(await LoginAsAdminAsync());

        var createResponse = await adminClient.PostAsJsonAsync("/api/admin/cars", NewCarPayload("InactiveTestCar"));
        var carId = (await ReadDataAsync<JsonElement>(createResponse)).GetProperty("id").GetInt32();

        await adminClient.PutAsJsonAsync($"/api/admin/cars/{carId}", new
        {
            name = "InactiveTestCar",
            brand = "Toyota",
            model = "Corolla",
            year = 2023,
            description = "A car",
            carType = "Sedan",
            fuelType = "Petrol",
            transmission = "Automatic",
            seats = 5,
            pricePerHour = 10m,
            location = "Dhaka",
            status = "Inactive"
        });

        var publicResponse = await Client.GetAsync("/api/cars?search=InactiveTestCar");
        var publicResult = await ReadDataAsync<JsonElement>(publicResponse);
        publicResult.GetProperty("items").EnumerateArray().Should().BeEmpty();

        var adminResponse = await adminClient.GetAsync("/api/admin/cars?search=InactiveTestCar");
        adminResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var adminResult = await ReadDataAsync<JsonElement>(adminResponse);
        var items = adminResult.GetProperty("items").EnumerateArray().ToList();
        items.Should().ContainSingle();
        items[0].GetProperty("status").GetString().Should().Be("Inactive");
    }
}
