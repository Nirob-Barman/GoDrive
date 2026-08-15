import type { TRole } from "./auth";

// Mirrors CleanArchitecture.Application.Users.Queries.GetMyProfile.UserProfileDto
export type TUserProfile = {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  profileImageUrl: string | null;
  nidOrPassportNumber: string | null;
  nidOrPassportImageUrl: string | null;
  drivingLicenseNumber: string | null;
  drivingLicenseImageUrl: string | null;
  role: TRole;
};

export type TUpdateProfileRequest = {
  fullName: string;
  phoneNumber?: string;
  address?: string;
  nidOrPassportNumber?: string;
  drivingLicenseNumber?: string;
};

// Mirrors CleanArchitecture.Application.Users.Queries.GetUsers.UserSummaryDto
export type TUserSummary = {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  isActive: boolean;
  role: TRole;
};
