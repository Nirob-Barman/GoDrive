import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { TAuthUser, TLoginResponse } from "../../../types/auth";

type TAuthState = {
  user: TAuthUser | null;
  token: string | null;
  refreshToken: string | null;
};

const initialState: TAuthState = {
  user: null,
  token: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<TLoginResponse>) => {
      const { token, refreshToken, userId, email, fullName, role } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.user = { userId, email, fullName, role };
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentRefreshToken = (state: RootState) => state.auth.refreshToken;
