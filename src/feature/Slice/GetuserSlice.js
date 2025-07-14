import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setAuthenticated, logout } from "./AuthSlice";

const URL = import.meta.env.VITE_REACT_APP;

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Authtoken");

      if (!token) {
        return rejectWithValue(
          "❌No token found. Please login again./GetuserSlice"
        );
      }
      if (!token) {
        dispatch(logout());
        return rejectWithValue("Token not found");
      }

      const response = await axios.get(`${URL}/api/auth/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("✅response --->/GetuserSlice", response);
      const userData = response?.data?.decoded;
      // console.log("userData --->getuserSilce", userData);

      if (userData && userData.email) {
        dispatch(setAuthenticated({ user: userData }));
        // console.log("userData.email --->getuserSilce", userData.email);
        return userData;
      } else {
        throw new Error("Invalid token");
      }
    } catch (error) {
      console.log("error --->/getuserSilce", error);
      dispatch(logout());
      return rejectWithValue("Authentication failed");
    }
  }
);

const getuserSlice = createSlice({
  name: "checkAuth",
  initialState: {
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuth.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default getuserSlice.reducer;
