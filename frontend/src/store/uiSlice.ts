import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type UiState = {
  language: string;
  // isFilter: boolean;
};

const initialState: UiState = {
  language: import.meta.env.VITE_LANGUAGE,
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
