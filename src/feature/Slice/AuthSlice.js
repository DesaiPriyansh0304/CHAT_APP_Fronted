import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("Authtoken") || null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addUser: (state, action) => {
      const { user, token, userId } = action.payload;

      const userData = {
        ...user,
        _id: user._id || userId || user.userId, // ensure _id exists
      };

      state.user = userData;
      state.token = token;
      state.isAuthenticated = true;

      localStorage.setItem("Authtoken", token);
      localStorage.setItem("AuthUser", JSON.stringify(userData));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("Authtoken");
    },
    setAuthenticated: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
  },
});

export const { addUser, logout, setAuthenticated } = authSlice.actions;
export default authSlice.reducer;
