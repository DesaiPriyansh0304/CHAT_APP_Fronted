import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "./AuthSlice";

const URL = import.meta.env.VITE_REACT_APP;
{
  /*Login User data*/
}
export const fetchLoginUser = createAsyncThunk(
  "user/fetchLoginUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Authtoken");
      // console.log("ℹ️ token --->/LoginUserSlice", token);
      if (!token) {
        dispatch(logout());
        return rejectWithValue("Token not found - LoginUserSlice");
      }

      const response = await axios.get(`${URL}/api/auth/getloginuser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("🧾response --->/LoginUserSlice", response);
      // console.log("📦LoginUserSlice response.data.user:", response.data.user);
      return response.data.user;
    } catch (error) {
      console.log("🔴error --->/LoginUserSlice", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch LoginUser Data"
      );
    }
  }
);

const userSlice = createSlice({
  name: "loginuser",
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
