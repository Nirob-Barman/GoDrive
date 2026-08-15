import { baseApi } from "../../api/baseApi";
import { buildQueryParams } from "../../../utils/queryParams";
import type { TApiEnvelope, TPaginatedList } from "../../../types/common";
import type { TCheckoutSession, TPayment, TPaymentFilters } from "../../../types/payments";

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation<TCheckoutSession, number>({
      query: (reservationId) => ({ url: `/payments/checkout/${reservationId}`, method: "POST" }),
      transformResponse: (response: TApiEnvelope<TCheckoutSession>) => response.data!,
    }),
    getMyPayments: builder.query<TPaginatedList<TPayment>, TPaymentFilters>({
      query: (filters) => ({ url: "/payments", params: buildQueryParams(filters) }),
      transformResponse: (response: TApiEnvelope<TPaginatedList<TPayment>>) => response.data!,
      providesTags: ["Payment"],
    }),
    getPaymentById: builder.query<TPayment, number>({
      query: (id) => `/payments/${id}`,
      transformResponse: (response: TApiEnvelope<TPayment>) => response.data!,
      providesTags: (_result, _error, id) => [{ type: "Payment", id }],
    }),
    getAllPayments: builder.query<TPaginatedList<TPayment>, TPaymentFilters>({
      query: (filters) => ({ url: "/admin/payments", params: buildQueryParams(filters) }),
      transformResponse: (response: TApiEnvelope<TPaginatedList<TPayment>>) => response.data!,
      providesTags: ["Payment"],
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetMyPaymentsQuery,
  useGetPaymentByIdQuery,
  useGetAllPaymentsQuery,
} = paymentsApi;
