import { Link, useParams } from "react-router-dom";
import { useGetCarByIdQuery } from "../../redux/features/cars/carsApi";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";

export default function CarDetails() {
  const { id } = useParams<{ id: string }>();
  const carId = Number(id);
  const user = useAppSelector(selectCurrentUser);

  const { data: car, isLoading, error } = useGetCarByIdQuery(carId, { skip: !Number.isFinite(carId) });

  if (isLoading) {
    return <p>Loading car...</p>;
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

      {car.averageRating !== null && (
        <p>
          {car.averageRating.toFixed(1)} / 5 ({car.reviewCount} review{car.reviewCount === 1 ? "" : "s"})
        </p>
      )}

      {car.description && <p>{car.description}</p>}

      <ul className="car-details-specs">
        <li>Seats: {car.seats}</li>
        <li>Fuel: {car.fuelType}</li>
        <li>Transmission: {car.transmission}</li>
        <li>Location: {car.location}</li>
        <li>Status: {car.status}</li>
      </ul>

      <p className="car-card-price">${car.pricePerHour.toFixed(2)} / hour</p>

      {!user ? (
        <Link to="/login" state={{ from: { pathname: `/cars/${car.id}` } }} className="book-now-button">
          Log in to book this car
        </Link>
      ) : (
        <Link to={`/book/${car.id}`} className="book-now-button">
          Book Now
        </Link>
      )}
    </div>
  );
}
