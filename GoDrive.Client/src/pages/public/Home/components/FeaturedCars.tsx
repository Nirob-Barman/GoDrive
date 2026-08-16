import { Link } from "react-router-dom";
import CarCard from "../../../../components/CarCard";
import { SkeletonGrid } from "../../../../components/ui/Skeleton";
import type { TCarListItem } from "../../../../types/cars";

type TFeaturedCarsProps = {
  cars: TCarListItem[];
  isLoading: boolean;
};

export default function FeaturedCars({ cars, isLoading }: TFeaturedCarsProps) {
  return (
    <section className="landing-section">
      <div className="landing-section-header">
        <h2>Find Your Perfect Ride</h2>
        <p>Explore some of the vehicles available through GoDrive.</p>
      </div>

      {isLoading && <SkeletonGrid count={6} />}
      {!isLoading && cars.length === 0 && (
        <p className="text-sm text-muted">No cars available right now — check back soon.</p>
      )}
      {cars.length > 0 && (
        <>
          <div className="car-grid">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
          <div className="landing-section-footer">
            <Link to="/cars" className="btn">
              View All Cars &rarr;
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
