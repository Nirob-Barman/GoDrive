using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Enums;
using FluentAssertions;

namespace CleanArchitecture.Domain.UnitTests;

public class ReservationTests
{
    private static Reservation CreateApprovedReservation()
    {
        var reservation = Reservation.Create("user-1", 1, 10m, DateTime.UtcNow.AddDays(1), DateTime.UtcNow.AddDays(2));
        reservation.Approve();
        return reservation;
    }

    [Fact]
    public void Create_calculates_total_hours_and_amount_from_price_per_hour()
    {
        var pickup = new DateTime(2026, 9, 1, 10, 0, 0, DateTimeKind.Utc);
        var dropoff = new DateTime(2026, 9, 2, 10, 0, 0, DateTimeKind.Utc);

        var reservation = Reservation.Create("user-1", 1, 12.5m, pickup, dropoff);

        reservation.TotalHours.Should().Be(24);
        reservation.TotalAmount.Should().Be(300m);
        reservation.Status.Should().Be(ReservationStatus.Pending);
        reservation.PaymentStatus.Should().Be(PaymentStatus.Unpaid);
    }

    [Fact]
    public void Create_rounds_partial_hours_up_to_a_full_hour()
    {
        var pickup = new DateTime(2026, 9, 1, 10, 0, 0, DateTimeKind.Utc);
        var dropoff = pickup.AddHours(1.5);

        var reservation = Reservation.Create("user-1", 1, 10m, pickup, dropoff);

        reservation.TotalHours.Should().Be(2);
        reservation.TotalAmount.Should().Be(20m);
    }

    [Fact]
    public void Create_throws_when_dropoff_is_not_after_pickup()
    {
        var pickup = DateTime.UtcNow.AddDays(1);

        var act = () => Reservation.Create("user-1", 1, 10m, pickup, pickup);

        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Approve_moves_pending_reservation_to_approved()
    {
        var reservation = Reservation.Create("user-1", 1, 10m, DateTime.UtcNow.AddDays(1), DateTime.UtcNow.AddDays(2));

        reservation.Approve();

        reservation.Status.Should().Be(ReservationStatus.Approved);
        reservation.ApprovedAtUtc.Should().NotBeNull();
    }

    [Fact]
    public void Approve_throws_when_reservation_is_not_pending()
    {
        var reservation = CreateApprovedReservation();

        var act = () => reservation.Approve();

        act.Should().Throw<InvalidOperationException>();
    }

    [Fact]
    public void Cancel_succeeds_only_while_pending()
    {
        var reservation = Reservation.Create("user-1", 1, 10m, DateTime.UtcNow.AddDays(1), DateTime.UtcNow.AddDays(2));

        reservation.Cancel();

        reservation.Status.Should().Be(ReservationStatus.Cancelled);
        reservation.CancelledAtUtc.Should().NotBeNull();
    }

    [Fact]
    public void Cancel_throws_once_the_reservation_has_been_approved()
    {
        var reservation = CreateApprovedReservation();

        var act = () => reservation.Cancel();

        act.Should().Throw<InvalidOperationException>()
            .WithMessage("*pending*");
    }

    [Fact]
    public void MarkPickedUp_throws_when_not_approved()
    {
        var reservation = Reservation.Create("user-1", 1, 10m, DateTime.UtcNow.AddDays(1), DateTime.UtcNow.AddDays(2));

        var act = () => reservation.MarkPickedUp();

        act.Should().Throw<InvalidOperationException>();
    }

    [Fact]
    public void MarkPickedUp_throws_when_approved_but_not_yet_paid()
    {
        var reservation = CreateApprovedReservation();

        var act = () => reservation.MarkPickedUp();

        act.Should().Throw<InvalidOperationException>()
            .WithMessage("*Payment*");
    }

    [Fact]
    public void MarkPickedUp_succeeds_once_approved_and_paid()
    {
        var reservation = CreateApprovedReservation();
        reservation.MarkPaid();

        reservation.MarkPickedUp();

        reservation.Status.Should().Be(ReservationStatus.PickedUp);
        reservation.PickedUpAtUtc.Should().NotBeNull();
    }

    [Fact]
    public void MarkReturned_throws_when_not_picked_up()
    {
        var reservation = CreateApprovedReservation();
        reservation.MarkPaid();

        var act = () => reservation.MarkReturned();

        act.Should().Throw<InvalidOperationException>();
    }

    [Fact]
    public void Full_lifecycle_reaches_returned()
    {
        var reservation = CreateApprovedReservation();
        reservation.MarkPaid();
        reservation.MarkPickedUp();

        reservation.MarkReturned();

        reservation.Status.Should().Be(ReservationStatus.Returned);
        reservation.ReturnedAtUtc.Should().NotBeNull();
    }

    [Fact]
    public void Reject_records_the_reason_and_is_only_valid_from_pending()
    {
        var reservation = Reservation.Create("user-1", 1, 10m, DateTime.UtcNow.AddDays(1), DateTime.UtcNow.AddDays(2));

        reservation.Reject("Car under maintenance");

        reservation.Status.Should().Be(ReservationStatus.Rejected);
        reservation.RejectionReason.Should().Be("Car under maintenance");

        var approved = CreateApprovedReservation();
        var act = () => approved.Reject("too late");
        act.Should().Throw<InvalidOperationException>();
    }
}
