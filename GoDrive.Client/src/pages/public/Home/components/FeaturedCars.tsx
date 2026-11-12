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
    <section>
      {/* Section Header */}
      <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
            Explore Our Fleet
          </span>

          <h2 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
            Find Your Perfect <span className="text-orange-500">Ride.</span>
          </h2>

          <p className="mt-3 text-sm leading-7 text-gray-500 sm:text-base">
            Discover our selection of vehicles and find the perfect companion
            for your next journey.
          </p>
        </div>

        {!isLoading && cars.length > 0 && (
          <Link
            to="/cars"
            className="inline-flex min-h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 transition duration-300 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            View All Cars
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>

      {/* Loading State */}
      {isLoading && <SkeletonGrid count={6} />}

      {/* Empty State */}
      {!isLoading && cars.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-3xl">
            🚗
          </div>

          <h3 className="text-lg font-bold text-gray-900">
            No Cars Available Yet
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-7 text-gray-500">
            We're updating our fleet. Check back soon to discover available
            vehicles for your next journey.
          </p>
        </div>
      )}

      {/* Car Grid */}
      {!isLoading && cars.length > 0 && (
        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {cars.map((car) => (
            <div
              key={car.id}
              className="min-w-0 transition duration-300 hover:-translate-y-1"
            >
              <CarCard car={car} />
            </div>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      {!isLoading && cars.length > 0 && (
        <div className="mt-12 flex justify-center">
          <Link
            to="/cars"
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-orange-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition duration-300 hover:-translate-y-1 hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
          >
            Explore All Vehicles
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </section>
  );
}
