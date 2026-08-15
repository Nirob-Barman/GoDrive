import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { logout, setCredentials } from "../features/auth/authSlice";
import type { TApiEnvelope } from "../../types/common";
import type { TAuthResponse } from "../../types/auth";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  // Required so the browser sends/receives the httpOnly refresh-token cookie cross-origin.
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Wraps fetchBaseQuery: on a 401, rotates the access token via /auth/refresh-token and
// retries the original request once. The refresh token itself is never read or sent by
// this code - it travels only as the httpOnly cookie the browser attaches automatically.
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await rawBaseQuery({ url: "/auth/refresh-token", method: "POST" }, api, extraOptions);

    const refreshData = refreshResult.data as TApiEnvelope<TAuthResponse> | undefined;

    if (refreshData?.data) {
      api.dispatch(setCredentials(refreshData.data));
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Car", "Reservation", "Review", "Payment", "User", "Dashboard"],
  endpoints: () => ({}),
});
