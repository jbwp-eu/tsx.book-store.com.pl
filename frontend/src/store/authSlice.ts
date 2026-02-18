import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthState = {
  userInfo: {
    name: string | null;
    email: string | null;
    isAdmin: boolean | null;
  };
};

function getInitialAuthState(): AuthState {
  if (typeof window === 'undefined') {
    return { userInfo: { name: null, email: null, isAdmin: null } };
  }
  try {
    const raw = localStorage.getItem('userInfo');
    if (!raw) return { userInfo: { name: null, email: null, isAdmin: null } };
    const parsed = JSON.parse(raw) as { name?: string; email?: string; isAdmin?: boolean };
    if (parsed && typeof parsed.isAdmin === 'boolean') {
      return {
        userInfo: {
          name: parsed.name ?? null,
          email: parsed.email ?? null,
          isAdmin: parsed.isAdmin,
        },
      };
    }
  } catch (_) {
    // ignore invalid stored data
  }
  return { userInfo: { name: null, email: null, isAdmin: null } };
}

const initialState: AuthState = getInitialAuthState();

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
