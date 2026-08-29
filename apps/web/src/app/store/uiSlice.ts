import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Rule } from "~/features/reference/rules/rules.types.ts";

interface UiState {
  selectedRule: Rule | null;
}

const initialState: UiState = {
  selectedRule: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openRuleDrawer(state, action: PayloadAction<Rule>) {
      state.selectedRule = action.payload;
    },

    closeRuleDrawer(state) {
      state.selectedRule = null;
    },
  },
});

export const { openRuleDrawer, closeRuleDrawer } = uiSlice.actions;

export default uiSlice.reducer;
