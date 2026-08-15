export type TCarType = "Sedan" | "SUV" | "Hatchback" | "Coupe" | "Convertible" | "Van" | "Truck";
export type TFuelType = "Petrol" | "Diesel" | "Hybrid" | "Electric";
export type TTransmissionType = "Automatic" | "Manual";
export type TCarStatus = "Active" | "Inactive" | "Maintenance";

// Mirrors CleanArchitecture.Application.Cars.Common.CarListItemDto
export type TCarListItem = {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  carType: TCarType;
  fuelType: TFuelType;
  transmission: TTransmissionType;
  seats: number;
  pricePerHour: number;
  location: string;
  status: TCarStatus;
  primaryImageUrl: string | null;
};

// Mirrors CleanArchitecture.Application.Cars.Common.CarImageDto
export type TCarImage = {
  id: number;
  url: string;
  isPrimary: boolean;
};

// Mirrors CleanArchitecture.Application.Cars.Common.CarDetailsDto
export type TCarDetails = {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  description: string | null;
  carType: TCarType;
  fuelType: TFuelType;
  transmission: TTransmissionType;
  seats: number;
  pricePerHour: number;
  location: string;
  status: TCarStatus;
  createdAt: string;
  updatedAt: string | null;
  images: TCarImage[];
  averageRating: number | null;
  reviewCount: number;
};

// Mirrors CleanArchitecture.Application.Cars.Queries.GetCars.GetCarsQuery
export type TCarFilters = {
  search?: string;
  carType?: TCarType;
  fuelType?: TFuelType;
  transmission?: TTransmissionType;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  pageNumber?: number;
  pageSize?: number;
};

// Mirrors CleanArchitecture.Application.Cars.Queries.GetAvailableCars.GetAvailableCarsQuery
export type TAvailableCarFilters = TCarFilters & {
  pickupDate: string;
  dropoffDate: string;
};

// Mirrors CleanArchitecture.Application.Cars.Commands.CreateCar.CreateCarCommand
export type TCreateCarRequest = {
  name: string;
  brand: string;
  model: string;
  year: number;
  description?: string;
  carType: TCarType;
  fuelType: TFuelType;
  transmission: TTransmissionType;
  seats: number;
  pricePerHour: number;
  location: string;
};

// Mirrors CleanArchitecture.Api.Controllers.Requests.UpdateCarRequest
export type TUpdateCarRequest = TCreateCarRequest & {
  status: TCarStatus;
};

// Mirrors CleanArchitecture.Application.Cars.Queries.GetAllCars.GetAllCarsQuery
export type TAdminCarFilters = TCarFilters & {
  status?: TCarStatus;
};
