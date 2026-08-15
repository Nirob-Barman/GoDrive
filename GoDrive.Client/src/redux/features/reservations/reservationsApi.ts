import { baseApi } from "../../api/baseApi";
import { buildQueryParams } from "../../../utils/queryParams";
import type { TApiEnvelope, TPaginatedList } from "../../../types/common";
import type {
  TAllReservationsFilters,
  TCreateReservationRequest,
  TMyReservationsFilters,
  TReservation,
  TUpdateReservationRequest,
} from "../../../types/reservations";

export const reservationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReservation: builder.mutation<TReservation, TCreateReservationRequest>({
      query: (body) => ({ url: "/reservations", method: "POST", body }),
      transformResponse: (response: TApiEnvelope<TReservation>) => response.data!,
      invalidatesTags: ["Reservation", "Car"],
    }),
    getMyReservations: builder.query<TPaginatedList<TReservation>, TMyReservationsFilters>({
      query: (filters) => ({ url: "/reservations", params: buildQueryParams(filters) }),
      transformResponse: (response: TApiEnvelope<TPaginatedList<TReservation>>) => response.data!,
      providesTags: ["Reservation"],
    }),
    getReservationById: builder.query<TReservation, number>({
      query: (id) => `/reservations/${id}`,
      transformResponse: (response: TApiEnvelope<TReservation>) => response.data!,
      providesTags: (_result, _error, id) => [{ type: "Reservation", id }],
    }),
    updateReservation: builder.mutation<TReservation, { id: number } & TUpdateReservationRequest>({
      query: ({ id, ...body }) => ({ url: `/reservations/${id}`, method: "PUT", body }),
      transformResponse: (response: TApiEnvelope<TReservation>) => response.data!,
      invalidatesTags: (_result, _error, { id }) => [{ type: "Reservation", id }, "Reservation"],
    }),
    cancelReservation: builder.mutation<void, number>({
      query: (id) => ({ url: `/reservations/${id}/cancel`, method: "PUT" }),
      invalidatesTags: (_result, _error, id) => [{ type: "Reservation", id }, "Reservation"],
    }),

    getAllReservations: builder.query<TPaginatedList<TReservation>, TAllReservationsFilters>({
      query: (filters) => ({ url: "/admin/reservations", params: buildQueryParams(filters) }),
      transformResponse: (response: TApiEnvelope<TPaginatedList<TReservation>>) => response.data!,
      providesTags: ["Reservation"],
    }),
    approveReservation: builder.mutation<TReservation, number>({
      query: (id) => ({ url: `/admin/reservations/${id}/approve`, method: "PUT" }),
      transformResponse: (response: TApiEnvelope<TReservation>) => response.data!,
      invalidatesTags: (_result, _error, id) => [{ type: "Reservation", id }, "Reservation", "Dashboard"],
    }),
    rejectReservation: builder.mutation<TReservation, { id: number; reason?: string }>({
      query: ({ id, reason }) => ({ url: `/admin/reservations/${id}/reject`, method: "PUT", body: { reason } }),
      transformResponse: (response: TApiEnvelope<TReservation>) => response.data!,
      invalidatesTags: (_result, _error, { id }) => [{ type: "Reservation", id }, "Reservation", "Dashboard"],
    }),
    markPickedUp: builder.mutation<TReservation, number>({
      query: (id) => ({ url: `/admin/reservations/${id}/pickup`, method: "PUT" }),
      transformResponse: (response: TApiEnvelope<TReservation>) => response.data!,
      invalidatesTags: (_result, _error, id) => [{ type: "Reservation", id }, "Reservation", "Dashboard"],
    }),
    returnCar: builder.mutation<TReservation, number>({
      query: (id) => ({ url: `/admin/reservations/${id}/return`, method: "PUT" }),
      transformResponse: (response: TApiEnvelope<TReservation>) => response.data!,
      invalidatesTags: (_result, _error, id) => [{ type: "Reservation", id }, "Reservation", "Car", "Dashboard"],
    }),
  }),
});

export const {
  useCreateReservationMutation,
  useGetMyReservationsQuery,
  useGetReservationByIdQuery,
  useUpdateReservationMutation,
  useCancelReservationMutation,
  useGetAllReservationsQuery,
  useApproveReservationMutation,
  useRejectReservationMutation,
  useMarkPickedUpMutation,
  useReturnCarMutation,
} = reservationsApi;
