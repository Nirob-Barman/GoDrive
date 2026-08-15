import { baseApi } from "../../api/baseApi";
import type { TApiEnvelope } from "../../../types/common";
import type { TUpdateProfileRequest, TUserProfile } from "../../../types/users";

function toFormData(request: TUpdateProfileRequest): FormData {
  const formData = new FormData();
  formData.set("fullName", request.fullName);
  if (request.phoneNumber) formData.set("phoneNumber", request.phoneNumber);
  if (request.address) formData.set("address", request.address);
  if (request.nidOrPassportNumber) formData.set("nIDOrPassportNumber", request.nidOrPassportNumber);
  if (request.drivingLicenseNumber) formData.set("drivingLicenseNumber", request.drivingLicenseNumber);
  return formData;
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query<TUserProfile, void>({
      query: () => "/users/me",
      transformResponse: (response: TApiEnvelope<TUserProfile>) => response.data!,
      providesTags: ["User"],
    }),
    updateMyProfile: builder.mutation<TUserProfile, TUpdateProfileRequest>({
      query: (request) => ({ url: "/users/me", method: "PUT", body: toFormData(request) }),
      transformResponse: (response: TApiEnvelope<TUserProfile>) => response.data!,
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetMyProfileQuery, useUpdateMyProfileMutation } = usersApi;
