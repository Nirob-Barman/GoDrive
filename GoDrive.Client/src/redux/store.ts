import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import type { WebStorage } from "redux-persist/es/types";
import { baseApi } from "./api/baseApi";
import authReducer from "./features/auth/authSlice";

// Written by hand against window.localStorage rather than imported from
// redux-persist/lib/storage: that CJS module's default export resolved unreliably
// under Vite's interop in live testing ("storage.getItem is not a function"), so
// this sidesteps the ambiguity entirely instead of chasing a bundler-specific fix.
const storage: WebStorage = {
  getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(window.localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
};

// Only `auth` is persisted - the RTK Query cache slice deliberately isn't,
// it should always refetch fresh on load rather than replay stale cached responses.
const persistConfig = {
  key: "godrive-auth",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
