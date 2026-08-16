import { baseApi } from "../../api/baseApi";
import type { TApiEnvelope } from "../../../types/common";
import type {
  TAuthResponse,
  TChangePasswordRequest,
  TForgotPasswordRequest,
  TLoginRequest,
  TRegisterRequest,
  TRegisterResponse,
  TResetPasswordRequest,
} from "../../../types/auth";

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
    changePassword: builder.mutation<string, TChangePasswordRequest>({
      query: (body) => ({ url: "/auth/change-password", method: "POST", body }),
      transformResponse: (response: TApiEnvelope<unknown>) => response.message,
    }),
    forgotPassword: builder.mutation<string, TForgotPasswordRequest>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
      transformResponse: (response: TApiEnvelope<unknown>) => response.message,
    }),
    resetPassword: builder.mutation<string, TResetPasswordRequest>({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
      transformResponse: (response: TApiEnvelope<unknown>) => response.message,
    }),
    // "Log out everywhere" - revokes every active refresh token for the user, including
    // this browser's own, so the caller should treat this exactly like a local logout too.
    revokeAllTokens: builder.mutation<void, void>({
      query: () => ({ url: "/auth/revoke-all-tokens", method: "POST" }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRevokeAllTokensMutation,
} = authApi;
