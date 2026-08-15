import { Link } from "react-router-dom";
import type { TCarListItem } from "../types/cars";

export default function CarCard({ car }: { car: TCarListItem }) {
  return (
    <Link to={`/cars/${car.id}`} className="car-card">
      <div className="car-card-image">
        {car.primaryImageUrl ? (
          <img src={car.primaryImageUrl} alt={car.name} />
        ) : (
          <div className="car-card-image-placeholder">No image</div>
        )}
      </div>
      <div className="car-card-body">
        <h2>{car.name}</h2>
        <p className="car-card-meta">
          {car.brand} {car.model} &middot; {car.year} &middot; {car.carType}
        </p>
        <p className="car-card-meta">
          {car.seats} seats &middot; {car.fuelType} &middot; {car.transmission}
        </p>
        <p className="car-card-location">{car.location}</p>
        <p className="car-card-price">${car.pricePerHour.toFixed(2)} / hour</p>
      </div>
    </Link>
  );
}
