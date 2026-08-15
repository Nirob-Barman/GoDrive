import { baseApi } from "../../api/baseApi";
import type { TApiEnvelope } from "../../../types/common";
import type { TAuthResponse, TLoginRequest, TRegisterRequest, TRegisterResponse } from "../../../types/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<TAuthResponse, TLoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      transformResponse: (response: TApiEnvelope<TAuthResponse>) => response.data!,
    }),
    register: builder.mutation<TRegisterResponse, TRegisterRequest>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      transformResponse: (response: TApiEnvelope<TRegisterResponse>) => response.data!,
    }),
    // No body - the refresh token being revoked is identified by the httpOnly cookie.
    logout: builder.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApi;
