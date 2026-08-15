export type TRole = "Admin" | "User";

export type TAuthUser = {
  userId: string;
  email: string;
  fullName: string;
  role: TRole;
};

// Mirrors CleanArchitecture.Application.Authentication.Commands.Login.LoginResponse
export type TLoginResponse = {
  token: string;
  expiresAtUtc: string;
  refreshToken: string;
  refreshTokenExpiresAtUtc: string;
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
