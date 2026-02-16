import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthState = {
  userInfo: {
    name: string | null;
    email: string | null;
    isAdmin: boolean | null;
  };
};

const initialState: AuthState = {
  userInfo: { name: null, email: null, isAdmin: null },
  // userInfo: { name: "test", email: "test@test.pl", isAdmin: null },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        name: string;
        email: string;
        isAdmin: boolean;
      }>
    ) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = { name: null, email: null, isAdmin: null };
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
