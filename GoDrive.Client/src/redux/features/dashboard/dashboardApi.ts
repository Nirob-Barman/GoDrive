import { baseApi } from "../../api/baseApi";
import { buildQueryParams } from "../../../utils/queryParams";
import type { TApiEnvelope } from "../../../types/common";
import type {
  TCarUtilization,
  TCarUtilizationFilters,
  TDashboardStatistics,
  TRevenueDataPoint,
  TRevenueFilters,
} from "../../../types/dashboard";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStatistics: builder.query<TDashboardStatistics, void>({
      query: () => "/admin/dashboard/statistics",
      transformResponse: (response: TApiEnvelope<TDashboardStatistics>) => response.data!,
      providesTags: ["Dashboard"],
    }),
    getRevenueByPeriod: builder.query<TRevenueDataPoint[], TRevenueFilters>({
      query: (filters) => ({ url: "/admin/dashboard/revenue", params: buildQueryParams(filters) }),
      transformResponse: (response: TApiEnvelope<TRevenueDataPoint[]>) => response.data!,
      providesTags: ["Dashboard"],
    }),
    getCarUtilization: builder.query<TCarUtilization[], TCarUtilizationFilters>({
      query: (filters) => ({ url: "/admin/dashboard/car-utilization", params: buildQueryParams(filters) }),
      transformResponse: (response: TApiEnvelope<TCarUtilization[]>) => response.data!,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardStatisticsQuery, useGetRevenueByPeriodQuery, useGetCarUtilizationQuery } = dashboardApi;
