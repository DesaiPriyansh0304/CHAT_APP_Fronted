import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const URL = import.meta.env.VITE_REACT_APP;

export const updateProfile = createAsyncThunk(
  "updateProfile/fetch",
  async (
    { profile_avatar, firstname, lastname, bio, mobile, dob, gender },
    { getState }
  ) => {
    const token = getState().auth.token;
    console.log("token update profile --->", token);

    try {
      const response = await axios.put(
        `${URL}/api/auth/update-profile`,
        {
          profile_avatar,
          firstname,
          lastname,
          bio,
          mobile,
          dob,
          gender,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("response /updateProfile--->", response);

      if (response.data.success) return response.data.user;
      throw new Error("Update profile failed");
    } catch (error) {
      toast.error("Update Profile Error");
      throw error;
    }
  }
);

const updateProfileSlice = createSlice({
  name: "updateProfile",
  initialState: {
    authUser: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.authUser = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default updateProfileSlice.reducer;
