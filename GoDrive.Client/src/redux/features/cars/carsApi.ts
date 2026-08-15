import { baseApi } from "../../api/baseApi";
import { buildQueryParams } from "../../../utils/queryParams";
import type { TApiEnvelope, TPaginatedList } from "../../../types/common";
import type {
  TAdminCarFilters,
  TAvailableCarFilters,
  TCarDetails,
  TCarFilters,
  TCarImage,
  TCarListItem,
  TCreateCarRequest,
  TUpdateCarRequest,
} from "../../../types/cars";

export const carsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCars: builder.query<TPaginatedList<TCarListItem>, TCarFilters>({
      query: (filters) => ({ url: "/cars", params: buildQueryParams(filters) }),
      transformResponse: (response: TApiEnvelope<TPaginatedList<TCarListItem>>) => response.data!,
      providesTags: ["Car"],
    }),
    getAvailableCars: builder.query<TPaginatedList<TCarListItem>, TAvailableCarFilters>({
      query: (filters) => ({ url: "/cars/available", params: buildQueryParams(filters) }),
      transformResponse: (response: TApiEnvelope<TPaginatedList<TCarListItem>>) => response.data!,
      providesTags: ["Car"],
    }),
    getCarById: builder.query<TCarDetails, number>({
      query: (id) => `/cars/${id}`,
      transformResponse: (response: TApiEnvelope<TCarDetails>) => response.data!,
      providesTags: (_result, _error, id) => [{ type: "Car", id }],
    }),

    // Admin-only counterpart to getCars - includes Inactive/Maintenance cars, which the
    // public listing deliberately excludes.
    getAllCars: builder.query<TPaginatedList<TCarListItem>, TAdminCarFilters>({
      query: (filters) => ({ url: "/admin/cars", params: buildQueryParams(filters) }),
      transformResponse: (response: TApiEnvelope<TPaginatedList<TCarListItem>>) => response.data!,
      providesTags: ["Car"],
    }),
    createCar: builder.mutation<TCarDetails, TCreateCarRequest>({
      query: (body) => ({ url: "/admin/cars", method: "POST", body }),
      transformResponse: (response: TApiEnvelope<TCarDetails>) => response.data!,
      invalidatesTags: ["Car"],
    }),
    updateCar: builder.mutation<TCarDetails, { id: number } & TUpdateCarRequest>({
      query: ({ id, ...body }) => ({ url: `/admin/cars/${id}`, method: "PUT", body }),
      transformResponse: (response: TApiEnvelope<TCarDetails>) => response.data!,
      invalidatesTags: (_result, _error, { id }) => [{ type: "Car", id }, "Car"],
    }),
    deleteCar: builder.mutation<void, number>({
      query: (id) => ({ url: `/admin/cars/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [{ type: "Car", id }, "Car"],
    }),
    addCarImages: builder.mutation<TCarImage[], { id: number; files: File[] }>({
      query: ({ id, files }) => {
        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));
        return { url: `/admin/cars/${id}/images`, method: "POST", body: formData };
      },
      transformResponse: (response: TApiEnvelope<TCarImage[]>) => response.data!,
      invalidatesTags: (_result, _error, { id }) => [{ type: "Car", id }, "Car"],
    }),
    deleteCarImage: builder.mutation<void, { carId: number; imageId: number }>({
      query: ({ carId, imageId }) => ({ url: `/admin/cars/${carId}/images/${imageId}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { carId }) => [{ type: "Car", id: carId }, "Car"],
    }),
  }),
});

export const {
  useGetCarsQuery,
  useGetAvailableCarsQuery,
  useGetCarByIdQuery,
  useGetAllCarsQuery,
  useCreateCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
  useAddCarImagesMutation,
  useDeleteCarImageMutation,
} = carsApi;
