import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "./AuthSlice";

const URL = import.meta.env.VITE_REACT_APP;

export const fetchLoginUser = createAsyncThunk(
  "user/fetchLoginUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Authtoken");
      // console.log("ℹ️token --->/LoginUserDataSlice", token);
      if (!token) {
        dispatch(logout()); // optional
        return rejectWithValue("Token not found");
      }

      const response = await axios.get(`${URL}/api/auth/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("✌️response --->", response);
      // console.log("✌️response.data.user --->", response.data.user);

      if (response.data.success && response.data.user) {
        const user = {
          ...response.data.user,
          _id: response.data.user._id || response.data.user.id,
        };
        console.log("✌️response.data.user._id --->", response.data.user._id);
        console.log("✌️response.data.user.id --->", response.data.user.id);

        return { user, token };
      } else {
        dispatch(logout());
        return rejectWithValue("Invalid response from server");
      }
    } catch (error) {
      dispatch(logout());
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

/* 🧠 Slice */
const loginUserSlice = createSlice({
  name: "loginUser",
  initialState: {
    userData: null,
    loading: false,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.userData = null;
      localStorage.removeItem("Authtoken");
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.user;
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser, setUserData } = loginUserSlice.actions;
export default loginUserSlice.reducer;
