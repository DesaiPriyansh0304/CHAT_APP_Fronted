import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = import.meta.env.VITE_REACT_APP;

// Existing fetchUnreadMessages thunk
export const fetchUnreadMessages = createAsyncThunk(
  "messages/fetchUnreadMessages",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Authtoken");
      // console.log("token --->fetchUnreadMessages", token);

      if (!token) {
        return rejectWithValue("Token not found");
      }

      const response = await axios.get(`${URL}/api/msg/unredmessage`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// New thunk to mark messages as read
export const markMessagesAsRead = createAsyncThunk(
  "messages/markMessagesAsRead",
  async (senderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Authtoken");

      if (!token) {
        return rejectWithValue("Token not found");
      }

      console.log("📧 Marking messages as read for sender:", senderId);

      const response = await axios.post(
        `${URL}/api/msg/mark-read`,
        { senderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Return senderId along with response to update state
      return { senderId, data: response.data };
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
    markingRead: false,
  },
  reducers: {
    clearUnreadMessages: (state) => {
      state.data = [];
      state.error = null;
    },

    removeUserUnreadMessages: (state, action) => {
      const senderId = action.payload;
      state.data = state.data.filter(
        (conversation) => conversation.user._id !== senderId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch unread messages
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
      })

      // Mark messages as read
      .addCase(markMessagesAsRead.pending, (state) => {
        state.markingRead = true;
      })
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        state.markingRead = false;
        const { senderId } = action.payload;

        // Remove the conversation from unread list
        state.data = state.data.filter(
          (conversation) => conversation.user._id !== senderId
        );

        console.log("✅ Messages marked as read for sender:", senderId);
      })
      .addCase(markMessagesAsRead.rejected, (state, action) => {
        state.markingRead = false;
        state.error = action.payload || "Failed to mark messages as read";
        console.error("❌ Error marking messages as read:", action.payload);
      });
  },
});

export const { clearUnreadMessages, removeUserUnreadMessages } =
  unreadMessageSlice.actions;
export default unreadMessageSlice.reducer;
