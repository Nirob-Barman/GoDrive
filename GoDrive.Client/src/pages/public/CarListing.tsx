import { useState } from "react";
import type { FormEvent } from "react";
import CarCard from "../../components/CarCard";
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
  };

  const goToPage = (page: number) => setFilters((current) => ({ ...current, pageNumber: page }));

  return (
    <div>
      <h1>Browse Cars</h1>

      <form className="car-filters" onSubmit={handleSubmit}>
        <input
          placeholder="Search"
          value={formState.search}
          onChange={(e) => setFormState({ ...formState, search: e.target.value })}
        />
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
        <input
          placeholder="Min price/hr"
          type="number"
          min="0"
          value={formState.minPrice}
          onChange={(e) => setFormState({ ...formState, minPrice: e.target.value })}
        />
        <input
          placeholder="Max price/hr"
          type="number"
          min="0"
          value={formState.maxPrice}
          onChange={(e) => setFormState({ ...formState, maxPrice: e.target.value })}
        />
        <input
          placeholder="Location"
          value={formState.location}
          onChange={(e) => setFormState({ ...formState, location: e.target.value })}
        />
        <button type="submit">Search</button>
      </form>

      {isLoading && <p>Loading cars...</p>}
      {error && <p className="form-error">Could not load cars.</p>}

      {data && (
        <>
          <div className="car-grid">
            {data.items.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
          {data.items.length === 0 && <p>No cars match your search.</p>}

          <div className="pagination">
            <button
              type="button"
              disabled={data.pageNumber <= 1 || isFetching}
              onClick={() => goToPage(data.pageNumber - 1)}
            >
              Previous
            </button>
            <span>
              Page {data.pageNumber} of {Math.max(data.totalPages, 1)}
            </span>
            <button
              type="button"
              disabled={data.pageNumber >= data.totalPages || isFetching}
              onClick={() => goToPage(data.pageNumber + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
