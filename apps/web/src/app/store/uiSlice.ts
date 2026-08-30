import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface OpenDrawer {
  type: "rule" | "profile";
  id: string;
}

interface UiState {
  drawers: OpenDrawer[];
}

const initialState: UiState = {
  drawers: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openDrawer(state, action: PayloadAction<OpenDrawer>) {
      const current = state.drawers.at(-1);
      const next = action.payload;

      if (current?.type === next.type && current.id === next.id) {
        return;
      }

      state.drawers.push(next);
    },

    closeDrawer(state) {
      state.drawers.pop();
    },
  },
});

export const { closeDrawer, openDrawer } = uiSlice.actions;

export function openRuleDrawer(ruleId: string) {
  return openDrawer({ type: "rule", id: ruleId });
}

export function openProfileDrawer(profileId: string) {
  return openDrawer({ type: "profile", id: profileId });
}

export default uiSlice.reducer;
