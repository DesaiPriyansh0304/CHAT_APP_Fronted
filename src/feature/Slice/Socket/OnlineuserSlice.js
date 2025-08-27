import { createSlice } from "@reduxjs/toolkit";

const onlineUsersSlice = createSlice({
  name: "onlineUsers",
  initialState: {
    users: [],
    lastUpdated: null,
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.users = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    clearOnlineUsers: (state) => {
      state.users = [];
      state.lastUpdated = null;
    },
  },
});

export const { setOnlineUsers, clearOnlineUsers } = onlineUsersSlice.actions;
console.log("setOnlineUsers --->", setOnlineUsers);

export const selectOnlineUsers = (state) => state.onlineUsers.users;

export const selectLastUpdated = (state) => state.onlineUsers.lastUpdated;

export default onlineUsersSlice.reducer;
