// src/redux/slices/settingsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lastSeen: false,
  readReceipts: false,
  security: false,
  profilephoto: "Everyone",
  status: "Everyone",
  groups: "Everyone",
  userStatus: "Available",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleLastSeen: (state) => {
      state.lastSeen = !state.lastSeen;
    },
    toggleReadReceipts: (state) => {
      state.readReceipts = !state.readReceipts;
    },
    togglesecurityReceipts: (state) => {
      state.security = !state.security;
    },
    setPrivacySetting: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    setUserStatus: (state, action) => {
      state.userStatus = action.payload;
    },
  },
});

export const {
  toggleLastSeen,
  toggleReadReceipts,
  togglesecurityReceipts,
  setPrivacySetting,
  setUserStatus,
} = settingsSlice.actions;
export default settingsSlice.reducer;
