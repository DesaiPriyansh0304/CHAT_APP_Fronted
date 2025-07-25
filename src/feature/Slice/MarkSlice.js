import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk to emit the event
export const markMessagesAsRead = createAsyncThunk(
  "markAsRead/markMessagesAsRead",
  async ({ senderId, receiverId }, { getState, rejectWithValue }) => {
    try {
      const socket = getState().socket.socket; // get socketInstance from redux

      if (socket && socket.connected) {
        console.log("✅ Emitting markMessagesAsRead", { senderId, receiverId });
        socket.emit("markMessagesAsRead", { senderId, receiverId });
        return { success: true };
      } else {
        return rejectWithValue("Socket not connected");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);

const markAsReadSlice = createSlice({
  name: "markAsRead",
  initialState: {
    isMarkingRead: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(markMessagesAsRead.pending, (state) => {
        state.isMarkingRead = true;
        state.error = null;
      })
      .addCase(markMessagesAsRead.fulfilled, (state) => {
        state.isMarkingRead = false;
      })
      .addCase(markMessagesAsRead.rejected, (state, action) => {
        state.isMarkingRead = false;
        state.error = action.payload || "Failed to mark messages as read";
      });
  },
});

export default markAsReadSlice.reducer;
