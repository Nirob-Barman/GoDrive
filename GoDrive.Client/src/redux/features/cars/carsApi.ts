import { baseApi } from "../../api/baseApi";
import { buildQueryParams } from "../../../utils/queryParams";
import type { TApiEnvelope, TPaginatedList } from "../../../types/common";
import type { TAvailableCarFilters, TCarDetails, TCarFilters, TCarListItem } from "../../../types/cars";

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
  }),
});

export const { useGetCarsQuery, useGetAvailableCarsQuery, useGetCarByIdQuery } = carsApi;
