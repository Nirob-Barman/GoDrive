import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetCarByIdQuery } from "../../redux/features/cars/carsApi";
import { useGetMyProfileQuery } from "../../redux/features/users/usersApi";
import { useCreateReservationMutation } from "../../redux/features/reservations/reservationsApi";
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
    return <p>Loading...</p>;
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
    <div className="auth-form">
      <h1>Book {car.name}</h1>
      <p className="car-card-price">${car.pricePerHour.toFixed(2)} / hour</p>

      <form onSubmit={handleSubmit}>
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

        <button type="submit" disabled={isBooking}>
          {isBooking ? "Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}
