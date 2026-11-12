import { useState } from "react";
import { Link } from "react-router-dom";
import type { TCarListItem } from "../types/cars";

export default function CarCard({ car }: { car: TCarListItem }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      to={`/cars/${car.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-gray-200/60"
    >
      {/* Car Image */}
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-gray-100">
        {car.primaryImageUrl && !imageError ? (
          <img
            src={car.primaryImageUrl}
            alt={car.name}
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
            <span className="text-3xl" aria-hidden="true">
              🚗
            </span>
            <span className="text-sm font-medium">No image available</span>
          </div>
        )}

        {/* Vehicle Type */}
        <span className="absolute left-4 top-4 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-bold text-gray-800 shadow-sm backdrop-blur">
          {car.carType}
        </span>

        {/* Status */}
        <span
          className={`absolute right-4 top-4 rounded-lg px-3 py-1.5 text-xs font-bold shadow-sm ${
            car.status === "Active"
              ? "bg-green-50 text-green-700"
              : car.status === "Maintenance"
                ? "bg-amber-50 text-amber-700"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          {car.status}
        </span>

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Name and Details */}
        <div className="min-h-[76px] border-b border-gray-100 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-extrabold text-gray-950 transition-colors group-hover:text-orange-500">
                {car.name}
              </h2>

              <p className="mt-1 truncate text-sm text-gray-500">
                {car.brand} {car.model} · {car.year}
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13l2-5a2 2 0 011.9-1.4h10.2A2 2 0 0119 8l2 5m-18 0h18m-18 0v4m18-4v4M5 17h14M7 17v2m10-2v2"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="grid min-h-[88px] grid-cols-3 items-center gap-2 border-b border-gray-100 py-4">
          {/* Seats */}
          <div className="text-center">
            <svg
              className="mx-auto h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 19v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1m6-9a4 4 0 100-8 4 4 0 000 8zm7-6a4 4 0 010 8m1 3a4 4 0 013 4v1"
              />
            </svg>

            <p className="mt-2 text-xs font-semibold text-gray-700">
              {car.seats} Seats
            </p>
          </div>

          {/* Fuel */}
          <div className="text-center">
            <svg
              className="mx-auto h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 3v3m10-3v3M5 6h14v14H5zM8 10h8m-8 4h5"
              />
            </svg>

            <p className="mt-2 text-xs font-semibold text-gray-700">
              {car.fuelType}
            </p>
          </div>

          {/* Transmission */}
          <div className="text-center">
            <svg
              className="mx-auto h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 7v5l3 2"
              />
            </svg>

            <p className="mt-2 text-xs font-semibold text-gray-700">
              {car.transmission}
            </p>
          </div>
        </div>

        {/* Location and Price */}
        <div className="mt-auto flex min-h-[85px] items-end justify-between gap-3 pt-5">
          <div className="flex min-w-0 flex-1 flex-col justify-end">
            {/* Location */}
            <div className="flex h-5 items-center gap-1.5 text-gray-400">
              <svg
                className="h-4 w-4 shrink-0 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1116 0z"
                />
                <circle cx="12" cy="10" r="2.5" />
              </svg>

              <span className="truncate text-xs font-medium">
                {car.location}
              </span>
            </div>

            {/* Price */}
            <div className="mt-2 flex h-7 items-center gap-1">
              <span className="text-xl font-extrabold leading-none text-gray-950">
                ${car.pricePerHour.toFixed(2)}
              </span>

              <span className="text-xs text-gray-400">/ hour</span>
            </div>
          </div>

          {/* View Details Arrow */}
          <span className="flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-xl bg-gray-950 text-white transition-all duration-300 group-hover:bg-orange-500">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14m-6-6l6 6-6 6"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
