export type TRole = "Admin" | "User";

export type TAuthUser = {
  userId: string;
  email: string;
  fullName: string;
  role: TRole;
};

// Mirrors CleanArchitecture.Api.Controllers.Responses.AuthResponse - deliberately has
// no refreshToken field. The refresh token never leaves the httpOnly cookie the
// backend sets directly; it's never visible to (or held by) this client's JS at all.
export type TAuthResponse = {
  token: string;
  expiresAtUtc: string;
  userId: string;
  email: string;
  fullName: string;
  role: TRole;
};

export type TLoginRequest = {
  email: string;
  password: string;
};

export type TRegisterRequest = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  termsAccepted: boolean;
};

// Mirrors CleanArchitecture.Application.Authentication.Commands.Register.RegisterResponse
export type TRegisterResponse = {
  userId: string;
  email: string;
};
