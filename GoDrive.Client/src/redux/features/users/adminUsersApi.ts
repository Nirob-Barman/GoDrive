import { baseApi } from "../../api/baseApi";
import { buildQueryParams } from "../../../utils/queryParams";
import type { TApiEnvelope, TPaginatedList } from "../../../types/common";
import type { TRole } from "../../../types/auth";
import type { TUserFilters, TUserProfile, TUserSummary } from "../../../types/users";

export const adminUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<TPaginatedList<TUserSummary>, TUserFilters>({
      query: (filters) => ({ url: "/admin/users", params: buildQueryParams(filters) }),
      transformResponse: (response: TApiEnvelope<TPaginatedList<TUserSummary>>) => response.data!,
      providesTags: (result) => [
        "User" as const,
        ...(result?.items.map((u) => ({ type: "User" as const, id: u.userId })) ?? []),
      ],
    }),
    getUserById: builder.query<TUserProfile, string>({
      query: (userId) => `/admin/users/${userId}`,
      transformResponse: (response: TApiEnvelope<TUserProfile>) => response.data!,
      providesTags: (_result, _error, userId) => [{ type: "User", id: userId }],
    }),
    setUserActiveStatus: builder.mutation<void, { userId: string; isActive: boolean }>({
      query: ({ userId, isActive }) => ({ url: `/admin/users/${userId}/status`, method: "PUT", body: { isActive } }),
      invalidatesTags: (_result, _error, { userId }) => [{ type: "User", id: userId }, "User"],
    }),
    changeUserRole: builder.mutation<void, { userId: string; role: TRole }>({
      query: ({ userId, role }) => ({ url: `/admin/users/${userId}/role`, method: "PUT", body: { role } }),
      invalidatesTags: (_result, _error, { userId }) => [{ type: "User", id: userId }, "User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useSetUserActiveStatusMutation,
  useChangeUserRoleMutation,
} = adminUsersApi;
