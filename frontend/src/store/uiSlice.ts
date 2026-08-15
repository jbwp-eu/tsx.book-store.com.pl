import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { env } from "@/lib/env";

type UiState = {
  language: string;
  // isFilter: boolean;
};

const initialState: UiState = {
  language: env.language,
  // isFilter: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<string>) {
      if (action.payload) {
        state.language = action.payload;
      }
    },
    // setFilter(state) {
    //   state.isFilter = !state.isFilter;
    // },
  },
});

export const { setLanguage /* setFilter */ } = uiSlice.actions;
