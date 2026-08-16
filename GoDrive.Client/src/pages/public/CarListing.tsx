import { useState } from "react";
import type { FormEvent } from "react";
import CarCard from "../../components/CarCard";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonGrid } from "../../components/ui/Skeleton";
import { useGetCarsQuery } from "../../redux/features/cars/carsApi";
import type { TCarFilters, TCarType, TFuelType, TTransmissionType } from "../../types/cars";

const CAR_TYPES: TCarType[] = ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Van", "Truck"];
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

export default function CarListing() {
  const [filters, setFilters] = useState<TCarFilters>({ pageNumber: 1, pageSize: 12 });
  const [formState, setFormState] = useState<TFilterFormState>(EMPTY_FORM_STATE);
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

  const goToPage = (page: number) => setFilters((current) => ({ ...current, pageNumber: page }));

  return (
    <div>
      <PageHeader
        title="Browse Cars"
        subtitle={data ? `${data.totalCount} car${data.totalCount === 1 ? "" : "s"} available` : undefined}
        actions={
          <button
            type="button"
            className="btn filter-toggle-btn"
            onClick={() => setFiltersOpen((open) => !open)}
          >
            {filtersOpen ? "Hide filters" : "Filters"}
          </button>
        }
      />

      <div className="car-listing-layout">
        <form className={`car-filters${filtersOpen ? " open" : ""}`} onSubmit={handleSubmit}>
          <label className="field-label">
            Search
            <input
              placeholder="Name, brand, model..."
              value={formState.search}
              onChange={(e) => setFormState({ ...formState, search: e.target.value })}
            />
          </label>
          <label className="field-label">
            Car type
            <select
              value={formState.carType}
              onChange={(e) => setFormState({ ...formState, carType: e.target.value as TCarType | "" })}
            >
              <option value="">Any type</option>
              {CAR_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="field-label">
            Fuel type
            <select
              value={formState.fuelType}
              onChange={(e) => setFormState({ ...formState, fuelType: e.target.value as TFuelType | "" })}
            >
              <option value="">Any fuel</option>
              {FUEL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="field-label">
            Transmission
            <select
              value={formState.transmission}
              onChange={(e) => setFormState({ ...formState, transmission: e.target.value as TTransmissionType | "" })}
            >
              <option value="">Any transmission</option>
              {TRANSMISSIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="field-label">
            Min price/hr
            <input
              type="number"
              min="0"
              value={formState.minPrice}
              onChange={(e) => setFormState({ ...formState, minPrice: e.target.value })}
            />
          </label>
          <label className="field-label">
            Max price/hr
            <input
              type="number"
              min="0"
              value={formState.maxPrice}
              onChange={(e) => setFormState({ ...formState, maxPrice: e.target.value })}
            />
          </label>
          <label className="field-label">
            Location
            <input
              value={formState.location}
              onChange={(e) => setFormState({ ...formState, location: e.target.value })}
            />
          </label>
          <button type="submit" className="btn btn-primary">
            Apply filters
          </button>
        </form>

        <div>
          {isLoading && <SkeletonGrid count={6} />}
          {error && <p className="form-error">Could not load cars. Please try again.</p>}

          {data && data.items.length === 0 && (
            <EmptyState
              title="No cars match your search"
              description="Try widening your filters — a different price range, location, or car type."
            />
          )}

          {data && data.items.length > 0 && (
            <>
              <div className="car-grid">
                {data.items.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>

              {data.totalPages > 1 && (
                <div className="pagination">
                  <button
                    type="button"
                    className="btn btn-sm"
                    disabled={data.pageNumber <= 1 || isFetching}
                    onClick={() => goToPage(data.pageNumber - 1)}
                  >
                    Previous
                  </button>
                  <span className="text-sm">
                    Page {data.pageNumber} of {data.totalPages}
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm"
                    disabled={data.pageNumber >= data.totalPages || isFetching}
                    onClick={() => goToPage(data.pageNumber + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
