import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetCarByIdQuery } from "../../redux/features/cars/carsApi";
import { useGetMyProfileQuery } from "../../redux/features/users/usersApi";
import { useCreateReservationMutation } from "../../redux/features/reservations/reservationsApi";
import PageHeader from "../../components/ui/PageHeader";
import { SkeletonRows } from "../../components/ui/Skeleton";
import { getErrorMessage } from "../../utils/getErrorMessage";

export default function BookCar() {
  const { carId } = useParams<{ carId: string }>();
  const carIdNumber = Number(carId);
  const navigate = useNavigate();

  const { data: car, isLoading: isLoadingCar } = useGetCarByIdQuery(carIdNumber, {
    skip: !Number.isFinite(carIdNumber),
  });
  const { data: profile, isLoading: isLoadingProfile } = useGetMyProfileQuery();
  const [createReservation, { isLoading: isBooking, error }] = useCreateReservationMutation();

  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");

  if (isLoadingCar || isLoadingProfile) {
    return (
      <div>
        <PageHeader title="Book a Car" />
        <SkeletonRows count={2} />
      </div>
    );
  }

  if (!car) {
    return (
      <div>
        <h1>Car not found</h1>
        <p>
          <Link to="/cars">Back to all cars</Link>
        </p>
      </div>
    );
  }

  const hasCompleteProfile = Boolean(profile?.nidOrPassportNumber && profile?.drivingLicenseNumber);

  if (!hasCompleteProfile) {
    return (
      <div>
        <h1>Complete your profile to book</h1>
        <p>
          A National ID/Passport number and Driving License number are required before booking a car.
        </p>
        <p>
          <Link to="/profile">Complete your profile</Link>
        </p>
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const result = await createReservation({
      carId: car.id,
      pickupDate: new Date(pickupDate).toISOString(),
      dropoffDate: new Date(dropoffDate).toISOString(),
    })
      .unwrap()
      .catch(() => null);

    if (result) {
      navigate("/reservations");
    }
  };

  return (
    <div>
      <PageHeader title={`Book ${car.name}`} subtitle={`${car.brand} ${car.model} · ${car.year}`} />

      <div className="form-section" style={{ maxWidth: "480px" }}>
        <p className="car-card-price">${car.pricePerHour.toFixed(2)} / hour</p>

        <form onSubmit={handleSubmit} className="field-group">
          <label>
            Pickup date &amp; time
            <input
              type="datetime-local"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              required
            />
          </label>
          <label>
            Drop-off date &amp; time
            <input
              type="datetime-local"
              value={dropoffDate}
              onChange={(e) => setDropoffDate(e.target.value)}
              required
            />
          </label>

          {error && <p className="form-error">{getErrorMessage(error)}</p>}

          <button type="submit" className="btn btn-primary" disabled={isBooking}>
            {isBooking ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}
