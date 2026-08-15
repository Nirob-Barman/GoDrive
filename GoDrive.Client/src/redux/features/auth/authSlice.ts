import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { TAuthResponse, TAuthUser } from "../../../types/auth";

type TAuthState = {
  user: TAuthUser | null;
  token: string | null;
};

const initialState: TAuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<TAuthResponse>) => {
      const { token, userId, email, fullName, role } = action.payload;
      state.token = token;
      state.user = { userId, email, fullName, role };
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;
