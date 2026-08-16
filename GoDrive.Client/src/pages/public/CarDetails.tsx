import { Link, useParams } from "react-router-dom";
import { useGetCarByIdQuery } from "../../redux/features/cars/carsApi";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import CarReviews from "../../components/CarReviews";
import { CarStatusBadge } from "../../components/ui/StatusBadge";
import Skeleton from "../../components/ui/Skeleton";

export default function CarDetails() {
  const { id } = useParams<{ id: string }>();
  const carId = Number(id);
  const user = useAppSelector(selectCurrentUser);

  const { data: car, isLoading, error } = useGetCarByIdQuery(carId, { skip: !Number.isFinite(carId) });

  if (isLoading) {
    return (
      <div className="car-details">
        <Skeleton height={420} />
        <div style={{ marginTop: "16px" }}>
          <Skeleton height={28} width="60%" />
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div>
        <h1>Car not found</h1>
        <p>
          <Link to="/cars">Back to all cars</Link>
        </p>
      </div>
    );
  }

  const primaryImage = car.images.find((i) => i.isPrimary) ?? car.images[0];

  return (
    <div className="car-details">
      <p>
        <Link to="/cars">&larr; Back to all cars</Link>
      </p>

      <div className="car-details-gallery">
        {primaryImage ? (
          <img src={primaryImage.url} alt={car.name} className="car-details-main-image" />
        ) : (
          <div className="car-card-image-placeholder">No image</div>
        )}
        {car.images.length > 1 && (
          <div className="car-details-thumbnails">
            {car.images.map((image) => (
              <img key={image.id} src={image.url} alt="" />
            ))}
          </div>
        )}
      </div>

      <h1>{car.name}</h1>
      <p className="car-card-meta">
        {car.brand} {car.model} &middot; {car.year} &middot; {car.carType}
      </p>

      <div className="reservation-meta-row">
        <CarStatusBadge status={car.status} />
        {car.averageRating !== null && (
          <span className="car-details-rating">
            <span className="car-details-rating-star">&#9733;</span>
            {car.averageRating.toFixed(1)} / 5 ({car.reviewCount} review{car.reviewCount === 1 ? "" : "s"})
          </span>
        )}
      </div>

      {car.description && <p>{car.description}</p>}

      <ul className="car-details-specs">
        <li>Seats: {car.seats}</li>
        <li>Fuel: {car.fuelType}</li>
        <li>Transmission: {car.transmission}</li>
        <li>Location: {car.location}</li>
      </ul>

      <p className="car-card-price">${car.pricePerHour.toFixed(2)} / hour</p>

      <div style={{ marginTop: "var(--space-4)" }}>
        {!user ? (
          <Link to="/login" state={{ from: { pathname: `/cars/${car.id}` } }} className="btn btn-primary btn-lg">
            Log in to book this car
          </Link>
        ) : (
          <Link to={`/book/${car.id}`} className="btn btn-primary btn-lg">
            Book Now
          </Link>
        )}
      </div>

      <CarReviews carId={car.id} />
    </div>
  );
}
