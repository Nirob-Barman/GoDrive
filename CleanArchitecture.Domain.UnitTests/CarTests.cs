using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Enums;
using FluentAssertions;

namespace CleanArchitecture.Domain.UnitTests;

public class CarTests
{
    private static Car CreateCar() => Car.Create(
        "Civic Turbo", "Honda", "Civic", 2023, "Sporty sedan",
        CarType.Sedan, FuelType.Petrol, TransmissionType.Automatic, 5, 10m, "Dhaka");

    [Fact]
    public void Create_starts_active_with_no_images()
    {
        var car = CreateCar();

        car.Status.Should().Be(CarStatus.Active);
        car.Images.Should().BeEmpty();
    }

    [Fact]
    public void AddImage_makes_the_first_image_primary()
    {
        var car = CreateCar();

        var image = car.AddImage("https://cdn/1.jpg", "public-1");

        image.IsPrimary.Should().BeTrue();
        car.Images.Should().ContainSingle().Which.Should().Be(image);
    }

    [Fact]
    public void AddImage_only_makes_the_first_image_primary()
    {
        var car = CreateCar();

        var first = car.AddImage("https://cdn/1.jpg", "public-1");
        var second = car.AddImage("https://cdn/2.jpg", "public-2");

        first.IsPrimary.Should().BeTrue();
        second.IsPrimary.Should().BeFalse();
    }

    [Fact]
    public void RemoveImage_promotes_another_image_to_primary_when_the_primary_is_removed()
    {
        var car = CreateCar();
        var first = car.AddImage("https://cdn/1.jpg", "public-1");
        var second = car.AddImage("https://cdn/2.jpg", "public-2");
        SetId(first, 1);
        SetId(second, 2);

        car.RemoveImage(first.Id);

        car.Images.Should().ContainSingle().Which.Should().Be(second);
        second.IsPrimary.Should().BeTrue();
    }

    [Fact]
    public void RemoveImage_does_not_touch_primary_when_a_non_primary_image_is_removed()
    {
        var car = CreateCar();
        var first = car.AddImage("https://cdn/1.jpg", "public-1");
        var second = car.AddImage("https://cdn/2.jpg", "public-2");
        SetId(first, 1);
        SetId(second, 2);

        car.RemoveImage(second.Id);

        car.Images.Should().ContainSingle().Which.Should().Be(first);
        first.IsPrimary.Should().BeTrue();
    }

    // CarImage.Id is only ever assigned by EF Core on save; in a pure in-memory unit test every new
    // image has Id == 0, so distinguishing them by ID needs a stand-in for what the DB would assign.
    private static void SetId(CarImage image, int id) =>
        typeof(CarImage).GetProperty(nameof(CarImage.Id))!.SetValue(image, id);

    [Fact]
    public void UpdateDetails_overwrites_fields_and_stamps_updated_time()
    {
        var car = CreateCar();

        car.UpdateDetails(
            "Civic Turbo Updated", "Honda", "Civic", 2024, "Updated description",
            CarType.Sedan, FuelType.Hybrid, TransmissionType.Manual, 4, 15m, "Chittagong", CarStatus.Maintenance);

        car.Name.Should().Be("Civic Turbo Updated");
        car.FuelType.Should().Be(FuelType.Hybrid);
        car.Status.Should().Be(CarStatus.Maintenance);
        car.UpdatedAtUtc.Should().NotBeNull();
    }
}
