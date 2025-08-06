import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = import.meta.env.VITE_REACT_APP;

export const fetchUnreadMessages = createAsyncThunk(
  "messages/fetchUnreadMessages",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Authtoken");
      console.log("✌️token --->", token);

      if (!token) {
        // You can dispatch logout here if needed
        return rejectWithValue("Token not found");
      }

      const response = await axios.get(`${URL}/api/msg/unredmessage`, {
        headers: {
          Authorization: `Bearer ${token}`, // In case your backend needs it
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const unreadMessageSlice = createSlice({
  name: "unreadMessages",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearUnreadMessages: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnreadMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnreadMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUnreadMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch unread messages";
      });
  },
});

export const { clearUnreadMessages } = unreadMessageSlice.actions;
export default unreadMessageSlice.reducer;
