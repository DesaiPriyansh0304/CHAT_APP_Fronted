import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("Authtoken");
const user = JSON.parse(localStorage.getItem("AuthUser"));

const initialState = {
  user: user || null,
  token: token || null,
  isAuthenticated: !!token && !!user,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //  Called on successful login
    addUser: (state, action) => {
      // Ensure _id is always present (fallback if missing)
      const { user, token, userId } = action.payload;
      const userData = {
        ...user,
        _id: user._id || userId || user.userId,
      };
      state.user = userData;
      state.token = token;
      state.isAuthenticated = true;
      // Store in localStorage
      localStorage.setItem("Authtoken", token);
      localStorage.setItem("AuthUser", JSON.stringify(userData));
    },
    // Logout and clear everything
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("Authtoken");
      localStorage.removeItem("AuthUser");
    },
    // Set user as authenticated
    setAuthenticated: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
  },
});

export const { addUser, logout, setAuthenticated } = authSlice.actions;
export default authSlice.reducer;
