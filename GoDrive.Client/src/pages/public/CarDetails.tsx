import { useState } from "react";
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

  const [activeImage, setActiveImage] = useState(0);

  const {
    data: car,
    isLoading,
    error,
  } = useGetCarByIdQuery(carId, {
    skip: !Number.isFinite(carId) || carId <= 0,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6">
        <Skeleton height={420} />
        <Skeleton height={32} width="60%" />
        <Skeleton height={100} />
      </div>
    );
  }

  if (error || !car) {
    return (
      <main className="flex min-h-[65vh] flex-col items-center justify-center px-6 text-center">
        <span className="text-sm font-bold tracking-[3px] text-orange-500">
          VEHICLE NOT FOUND
        </span>
        <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
          This ride isn't available.
        </h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-gray-500">
          The vehicle may have been removed or the link might be incorrect.
        </p>
        <Link
          to="/cars"
          className="mt-7 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
        >
          Explore available cars
        </Link>
      </main>
    );
  }

  const images = car.images;
  const primaryImage = images.find((image) => image.isPrimary) ?? images[0];
  const selectedImage = images[activeImage] ?? primaryImage;

  const specifications = [
    { label: "Seats", value: `${car.seats} Seats`, icon: "♙" },
    { label: "Fuel type", value: car.fuelType, icon: "⛽" },
    { label: "Transmission", value: car.transmission, icon: "⚙" },
    { label: "Vehicle type", value: car.carType, icon: "🚘" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm">
          <Link
            to="/"
            className="text-gray-400 transition hover:text-orange-500"
          >
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <Link
            to="/cars"
            className="text-gray-400 transition hover:text-orange-500"
          >
            Browse cars
          </Link>
          <span className="text-gray-300">/</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {car.name}
          </span>
        </div>

        {/* Page Heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-extrabold tracking-[3px] text-orange-500">
              DISCOVER YOUR NEXT RIDE
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl dark:text-white">
              {car.name}
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {car.brand} {car.model} · {car.year} · {car.carType}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <CarStatusBadge status={car.status} />
            {car.averageRating !== null && (
              <span className="flex items-center gap-1 text-sm font-bold text-gray-700 dark:text-gray-200">
                <span className="text-lg text-amber-500">★</span>
                {car.averageRating.toFixed(1)}
                <span className="font-normal text-gray-400">
                  ({car.reviewCount} reviews)
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_370px]">
          {/* Left Content */}
          <div className="min-w-0">
            {/* Image Gallery */}
            <section>
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-gray-200 shadow-sm sm:aspect-[16/9] dark:bg-gray-800">
                {selectedImage ? (
                  <img
                    src={selectedImage.url}
                    alt={car.name}
                    className="h-full w-full object-cover transition duration-500"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    No vehicle image available
                  </div>
                )}

                <div className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/50 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
                  {images.length > 0
                    ? `${activeImage + 1} / ${images.length} Photos`
                    : "Vehicle gallery"}
                </div>
              </div>

              {images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`View image ${index + 1}`}
                      aria-pressed={activeImage === index}
                      className={`h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-24 sm:w-36 ${
                        activeImage === index
                          ? "border-orange-500 opacity-100"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${car.name} view ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Description */}
            <section className="mt-12">
              <div className="mb-5">
                <span className="text-xs font-bold tracking-[2px] text-orange-500">
                  ABOUT THE VEHICLE
                </span>
                <h2 className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">
                  Experience the ride
                </h2>
              </div>

              <p className="max-w-3xl text-sm leading-8 text-gray-500 dark:text-gray-400">
                {car.description ||
                  `Discover the ${car.name}, a ${car.year} ${car.carType} designed to make every journey comfortable and enjoyable.`}
              </p>
            </section>

            {/* Specifications */}
            <section className="mt-12">
              <span className="text-xs font-bold tracking-[2px] text-orange-500">
                VEHICLE INFORMATION
              </span>
              <h2 className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">
                Vehicle specifications
              </h2>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {specifications.map((spec) => (
                  <div
                    key={spec.label}
                    className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-orange-200 dark:border-gray-800 dark:bg-gray-900"
                  >
                    <span className="text-2xl text-orange-500">
                      {spec.icon}
                    </span>
                    <p className="mt-4 text-xs text-gray-400">{spec.label}</p>
                    <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Location */}
            <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-xl text-orange-500 dark:bg-orange-500/10">
                  📍
                </div>
                <div>
                  <p className="text-xs text-gray-400">Vehicle location</p>
                  <p className="mt-1 font-bold text-gray-900 dark:text-white">
                    {car.location}
                  </p>
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section className="mt-12">
              <CarReviews carId={car.id} />
            </section>
          </div>

          {/* Booking Card */}
          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="bg-gray-950 p-7 text-white">
                <span className="text-xs font-bold tracking-[2px] text-orange-400">
                  YOUR NEXT JOURNEY
                </span>

                <div className="mt-4 flex items-end gap-2">
                  <span className="text-4xl font-extrabold">
                    ${car.pricePerHour.toFixed(2)}
                  </span>
                  <span className="pb-1 text-sm text-gray-400">/ hour</span>
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  Transparent pricing for your journey.
                </p>
              </div>

              <div className="space-y-5 p-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
                  <span className="text-sm text-gray-500">Vehicle</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {car.name}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
                  <span className="text-sm text-gray-500">Location</span>
                  <span className="max-w-[160px] text-right text-sm font-semibold text-gray-900 dark:text-white">
                    {car.location}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
                  <span className="text-sm text-gray-500">Availability</span>
                  <CarStatusBadge status={car.status} />
                </div>

                {car.status === "Available" ? (
                  user ? (
                    <Link
                      to={`/book/${car.id}`}
                      className="flex w-full items-center justify-center gap-3 rounded-xl bg-orange-500 px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-orange-600"
                    >
                      Book this car <span>→</span>
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      state={{
                        from: { pathname: `/cars/${car.id}` },
                      }}
                      className="flex w-full items-center justify-center gap-3 rounded-xl bg-orange-500 px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-orange-600"
                    >
                      Log in to book <span>→</span>
                    </Link>
                  )
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full cursor-not-allowed rounded-xl bg-gray-200 px-6 py-4 text-sm font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  >
                    Currently unavailable
                  </button>
                )}

                <p className="text-center text-xs leading-6 text-gray-400">
                  Ready for your next adventure? Book your ride and hit the road
                  with GoDrive.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
