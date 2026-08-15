import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { logout, setCredentials } from "../features/auth/authSlice";
import type { TApiEnvelope } from "../../types/common";
import type { TLoginResponse } from "../../types/auth";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Wraps fetchBaseQuery: on a 401, rotates the token pair via /auth/refresh-token and
// retries the original request once. GoDrive's refresh endpoint revokes the presented
// refresh token and issues a brand new pair, so both token and refreshToken must be
// overwritten together - never just the access token.
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        { url: "/auth/refresh-token", method: "POST", body: { refreshToken } },
        api,
        extraOptions,
      );

      const refreshData = refreshResult.data as TApiEnvelope<TLoginResponse> | undefined;

      if (refreshData?.data) {
        api.dispatch(setCredentials(refreshData.data));
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
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
