import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const URL = import.meta.env.VITE_REACT_APP;

export const getUserMessage = createAsyncThunk(
  "getUserMessage/fetch",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    // console.log("token update profile --->/getUserMessage", token);

    try {
      const response = await axios.get(`${URL}/api/msg/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        return {
          users: response.data.users,
          unseenMessages: response.data.unseenMessages,
        };
      }
      // console.log("response /msg/user--->", response);
      return rejectWithValue("Failed to fetch user messages");
    } catch (error) {
      toast.error("Update Profile Error");
      return rejectWithValue(error.message);
    }
  }
);

const getUserMessageSlice = createSlice({
  name: "getUserMessage",
  initialState: {
    authUser: [],
    unseenMessages: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserMessage.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getUserMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.authUser = action.payload.users;
        state.unseenMessages = action.payload.unseenMessages;
      })
      .addCase(getUserMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default getUserMessageSlice.reducer;
