import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddCarImagesMutation,
  useCreateCarMutation,
  useDeleteCarImageMutation,
  useGetCarByIdQuery,
  useUpdateCarMutation,
} from "../../redux/features/cars/carsApi";
import PageHeader from "../../components/ui/PageHeader";
import type { TCarStatus, TCarType, TFuelType, TTransmissionType } from "../../types/cars";
import { getErrorMessage } from "../../utils/getErrorMessage";

const CAR_TYPES: TCarType[] = ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Van", "Truck"];
const FUEL_TYPES: TFuelType[] = ["Petrol", "Diesel", "Hybrid", "Electric"];
const TRANSMISSIONS: TTransmissionType[] = ["Automatic", "Manual"];
const STATUSES: TCarStatus[] = ["Active", "Inactive", "Maintenance"];

type TFormState = {
  name: string;
  brand: string;
  model: string;
  year: string;
  description: string;
  carType: TCarType;
  fuelType: TFuelType;
  transmission: TTransmissionType;
  seats: string;
  pricePerHour: string;
  location: string;
  status: TCarStatus;
};

const EMPTY_FORM: TFormState = {
  name: "",
  brand: "",
  model: "",
  year: String(new Date().getFullYear()),
  description: "",
  carType: "Sedan",
  fuelType: "Petrol",
  transmission: "Automatic",
  seats: "5",
  pricePerHour: "",
  location: "",
  status: "Active",
};

export default function CarForm() {
  const { id } = useParams<{ id: string }>();
  const carId = id ? Number(id) : undefined;
  const isEditMode = carId !== undefined;
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    data: car,
    isLoading: isLoadingCar,
    error: loadCarError,
  } = useGetCarByIdQuery(carId ?? 0, { skip: !isEditMode });
  const [createCar, { isLoading: isCreating, error: createError }] = useCreateCarMutation();
  const [updateCar, { isLoading: isUpdating, error: updateError }] = useUpdateCarMutation();
  const [addCarImages, { isLoading: isUploading, error: uploadError }] = useAddCarImagesMutation();
  const [deleteCarImage] = useDeleteCarImageMutation();

  const [form, setForm] = useState<TFormState>(EMPTY_FORM);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!car) return;
    setForm({
      name: car.name,
      brand: car.brand,
      model: car.model,
      year: String(car.year),
      description: car.description ?? "",
      carType: car.carType,
      fuelType: car.fuelType,
      transmission: car.transmission,
      seats: String(car.seats),
      pricePerHour: String(car.pricePerHour),
      location: car.location,
      status: car.status,
    });
  }, [car]);

  const error = createError ?? updateError ?? uploadError;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaved(false);

    const basePayload = {
      name: form.name,
      brand: form.brand,
      model: form.model,
      year: Number(form.year),
      description: form.description || undefined,
      carType: form.carType,
      fuelType: form.fuelType,
      transmission: form.transmission,
      seats: Number(form.seats),
      pricePerHour: Number(form.pricePerHour),
      location: form.location,
    };

    if (isEditMode) {
      const result = await updateCar({ id: carId, ...basePayload, status: form.status }).unwrap().catch(() => null);
      if (result) setSaved(true);
    } else {
      const result = await createCar(basePayload).unwrap().catch(() => null);
      if (result) navigate(`/admin/cars/${result.id}/edit`, { replace: true });
    }
  };

  const handleAddImages = async () => {
    const files = fileInputRef.current?.files;
    if (!carId || !files || files.length === 0) return;

    await addCarImages({ id: carId, files: Array.from(files) }).unwrap().catch(() => null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (isEditMode && isLoadingCar) {
    return <p>Loading car...</p>;
  }

  if (isEditMode && (loadCarError || !car)) {
    return <p className="form-error">Could not load this car - it may have been deleted.</p>;
  }

  return (
    <div>
      <PageHeader title={isEditMode ? "Edit Car" : "Add Car"} />

      <form onSubmit={handleSubmit} style={{ maxWidth: "640px" }}>
        <div className="form-section">
          <h2>Basic Information</h2>
          <div className="field-group">
            <label>
              Name
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>
              Brand
              <input type="text" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
            </label>
            <label>
              Model
              <input type="text" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required />
            </label>
            <label>
              Year
              <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required />
            </label>
            <label>
              Description
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </label>
          </div>
        </div>

        <div className="form-section">
          <h2>Vehicle Specifications</h2>
          <div className="field-group">
            <label>
              Car type
              <select value={form.carType} onChange={(e) => setForm({ ...form, carType: e.target.value as TCarType })}>
                {CAR_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Fuel type
              <select value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value as TFuelType })}>
                {FUEL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Transmission
              <select
                value={form.transmission}
                onChange={(e) => setForm({ ...form, transmission: e.target.value as TTransmissionType })}
              >
                {TRANSMISSIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Seats
              <input type="number" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} required />
            </label>
          </div>
        </div>

        <div className="form-section">
          <h2>Rental Information</h2>
          <div className="field-group">
            <label>
              Price per hour
              <input
                type="number"
                step="0.01"
                value={form.pricePerHour}
                onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })}
                required
              />
            </label>
            <label>
              Location
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
            </label>
          </div>
        </div>

        {isEditMode && (
          <div className="form-section">
            <h2>Status</h2>
            <div className="field-group">
              <label>
                Availability status
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TCarStatus })}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        )}

        {error && <p className="form-error">{getErrorMessage(error)}</p>}
        {saved && <p className="form-success">Saved.</p>}

        <button type="submit" className="btn btn-primary" disabled={isCreating || isUpdating}>
          {isCreating || isUpdating ? "Saving..." : isEditMode ? "Save Changes" : "Create Car"}
        </button>
      </form>

      {isEditMode && car && (
        <div className="form-section" style={{ maxWidth: "640px", marginTop: "24px" }}>
          <h2>Images</h2>

          {car.images.length === 0 && <p className="text-sm text-muted">No images yet.</p>}

          <div className="car-image-manager">
            {car.images.map((image) => (
              <div key={image.id} className="car-image-manager-item">
                <img src={image.url} alt="" />
                <button type="button" className="btn btn-sm btn-danger" onClick={() => deleteCarImage({ carId, imageId: image.id })}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="car-image-upload">
            <input ref={fileInputRef} type="file" accept="image/*" multiple />
            <button type="button" className="btn" onClick={handleAddImages} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload Images"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
