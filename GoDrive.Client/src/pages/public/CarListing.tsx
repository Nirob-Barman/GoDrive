import { useState } from "react";
import type { FormEvent } from "react";
import CarCard from "../../components/CarCard";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonGrid } from "../../components/ui/Skeleton";
import { useGetCarsQuery } from "../../redux/features/cars/carsApi";
import type {
  TCarFilters,
  TCarType,
  TFuelType,
  TTransmissionType,
} from "../../types/cars";

const CAR_TYPES: TCarType[] = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Coupe",
  "Convertible",
  "Van",
  "Truck",
];

const FUEL_TYPES: TFuelType[] = ["Petrol", "Diesel", "Hybrid", "Electric"];

const TRANSMISSIONS: TTransmissionType[] = ["Automatic", "Manual"];

type TFilterFormState = {
  search: string;
  carType: TCarType | "";
  fuelType: TFuelType | "";
  transmission: TTransmissionType | "";
  minPrice: string;
  maxPrice: string;
  location: string;
};

const EMPTY_FORM_STATE: TFilterFormState = {
  search: "",
  carType: "",
  fuelType: "",
  transmission: "",
  minPrice: "",
  maxPrice: "",
  location: "",
};

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10";

const labelClass = "mb-2 block text-sm font-semibold text-gray-700";

export default function CarListing() {
  const [filters, setFilters] = useState<TCarFilters>({
    pageNumber: 1,
    pageSize: 12,
  });

  const [formState, setFormState] =
    useState<TFilterFormState>(EMPTY_FORM_STATE);

  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data, isLoading, isFetching, error } = useGetCarsQuery(filters);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    setFilters({
      search: formState.search || undefined,
      carType: formState.carType || undefined,
      fuelType: formState.fuelType || undefined,
      transmission: formState.transmission || undefined,
      minPrice: formState.minPrice ? Number(formState.minPrice) : undefined,
      maxPrice: formState.maxPrice ? Number(formState.maxPrice) : undefined,
      location: formState.location || undefined,
      pageNumber: 1,
      pageSize: 12,
    });

    setFiltersOpen(false);
  };

  const handleReset = () => {
    setFormState(EMPTY_FORM_STATE);
    setFilters({
      pageNumber: 1,
      pageSize: 12,
    });
  };

  const goToPage = (page: number) => {
    setFilters((current) => ({
      ...current,
      pageNumber: page,
    }));
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-orange-500">
                <span className="h-px w-7 bg-orange-500" />
                FIND YOUR PERFECT RIDE
              </span>

              <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
                Explore Our <span className="text-orange-500">Cars</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
                Discover the perfect vehicle for your next journey. Browse our
                collection and find a ride that matches your style and budget.
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-3">
                <p className="text-2xl font-extrabold text-gray-900">
                  {data?.totalCount ?? "—"}
                </p>
                <p className="text-xs font-medium text-gray-500">
                  Cars available
                </p>
              </div>

              <button
                type="button"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 lg:hidden"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M7 12h10m-7 6h4"
                  />
                </svg>
                {filtersOpen ? "Hide filters" : "Filters"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Listing Section */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Filters Sidebar */}
          <aside
            className={`${
              filtersOpen ? "block" : "hidden"
            } lg:sticky lg:top-24 lg:block`}
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Find your ideal vehicle
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-semibold text-orange-500 transition hover:text-orange-600"
                >
                  Reset all
                </button>
              </div>

              {/* Search */}
              <div className="mb-5">
                <label className={labelClass}>Search cars</label>
                <input
                  type="text"
                  placeholder="Brand, model or name..."
                  value={formState.search}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      search: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </div>

              <div className="mb-5 border-t border-gray-100" />

              {/* Car Type */}
              <div className="mb-5">
                <label className={labelClass}>Vehicle type</label>
                <select
                  value={formState.carType}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      carType: e.target.value as TCarType | "",
                    })
                  }
                  className={inputClass}
                >
                  <option value="">All vehicle types</option>
                  {CAR_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fuel Type */}
              <div className="mb-5">
                <label className={labelClass}>Fuel type</label>
                <select
                  value={formState.fuelType}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      fuelType: e.target.value as TFuelType | "",
                    })
                  }
                  className={inputClass}
                >
                  <option value="">All fuel types</option>
                  {FUEL_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transmission */}
              <div className="mb-5">
                <label className={labelClass}>Transmission</label>
                <select
                  value={formState.transmission}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      transmission: e.target.value as TTransmissionType | "",
                    })
                  }
                  className={inputClass}
                >
                  <option value="">All transmissions</option>
                  {TRANSMISSIONS.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-5 border-t border-gray-100" />

              {/* Price Range */}
              <div className="mb-5">
                <label className={labelClass}>Price range / hour</label>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={formState.minPrice}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        minPrice: e.target.value,
                      })
                    }
                    className={inputClass}
                  />

                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={formState.maxPrice}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        maxPrice: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className={labelClass}>Location</label>
                <input
                  type="text"
                  placeholder="Enter location..."
                  value={formState.location}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      location: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-600"
              >
                Apply filters
                <span>→</span>
              </button>
            </form>
          </aside>

          {/* Car Results */}
          <div className="min-w-0">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Available Vehicles
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {data
                    ? `Showing ${data.items.length} of ${data.totalCount} cars`
                    : "Discover your next ride"}
                </p>
              </div>

              {isFetching && !isLoading && (
                <span className="text-xs font-medium text-orange-500">
                  Updating results...
                </span>
              )}
            </div>

            {/* Loading */}
            {isLoading && <SkeletonGrid count={6} />}

            {/* Error */}
            {error && !isLoading && (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
                <p className="font-semibold text-red-600">
                  Could not load cars.
                </p>
                <p className="mt-2 text-sm text-red-500">
                  Please try again later.
                </p>
              </div>
            )}

            {/* Empty State */}
            {data && data.items.length === 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-8">
                <EmptyState
                  title="No cars match your search"
                  description="Try widening your filters — a different price range, location, or car type."
                />

                <div className="mt-5 text-center">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-sm font-bold text-orange-500 hover:text-orange-600"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}

            {/* Car Grid */}
            {data && data.items.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {data.items.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>

                {/* Pagination */}
                {data.totalPages > 1 && (
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white p-4">
                    <button
                      type="button"
                      disabled={data.pageNumber <= 1 || isFetching}
                      onClick={() => goToPage(data.pageNumber - 1)}
                      className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-orange-500 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ← Previous
                    </button>

                    <span className="text-sm font-medium text-gray-600">
                      Page{" "}
                      <span className="font-bold text-gray-900">
                        {data.pageNumber}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-gray-900">
                        {data.totalPages}
                      </span>
                    </span>

                    <button
                      type="button"
                      disabled={
                        data.pageNumber >= data.totalPages || isFetching
                      }
                      onClick={() => goToPage(data.pageNumber + 1)}
                      className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-orange-500 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
