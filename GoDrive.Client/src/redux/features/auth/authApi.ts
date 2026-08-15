import { baseApi } from "../../api/baseApi";
import type { TApiEnvelope } from "../../../types/common";
import type { TLoginRequest, TLoginResponse, TRegisterRequest, TRegisterResponse } from "../../../types/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<TLoginResponse, TLoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      transformResponse: (response: TApiEnvelope<TLoginResponse>) => response.data!,
    }),
    register: builder.mutation<TRegisterResponse, TRegisterRequest>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      transformResponse: (response: TApiEnvelope<TRegisterResponse>) => response.data!,
    }),
    logout: builder.mutation<void, { refreshToken: string }>({
      query: (body) => ({ url: "/auth/logout", method: "POST", body }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApi;
