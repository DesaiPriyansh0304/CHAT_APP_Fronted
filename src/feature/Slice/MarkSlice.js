import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = import.meta.env.VITE_REACT_APP;

export const markMessageSeen = createAsyncThunk(
  "messages/markSeen",
  async (messageId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;

    try {
      await axios.put(
        `${URL}/api/msg/mark/${messageId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return messageId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const messageSlice = createSlice({
  name: "markmessages",
  initialState: {
    messages: [],
    unseenMessages: {},
    status: "idle",
    error: null,
  },
  reducers: {
    receiveMessage: (state, action) => {
      const { message, selectedUserId } = action.payload;

      if (selectedUserId && message.senderId === selectedUserId) {
        message.seen = true;
        state.messages.push(message);
      } else {
        state.unseenMessages[message.senderId] =
          (state.unseenMessages[message.senderId] || 0) + 1;
      }
    },
    setSelectedUser: (state, action) => {
      const userId = action.payload;
      if (state.unseenMessages[userId]) {
        delete state.unseenMessages[userId];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(markMessageSeen.pending, (state) => {
        state.status = "loading";
      })
      .addCase(markMessageSeen.fulfilled, (state, action) => {
        state.status = "succeeded";

        const messageId = action.payload;
        console.log("messageId/markmessage --->", messageId);
        for (const senderId in state.unseenMessages) {
          if (state.unseenMessages[senderId] > 0) {
            state.unseenMessages[senderId] -= 1;
            if (state.unseenMessages[senderId] === 0) {
              delete state.unseenMessages[senderId];
            }
            break;
          }
        }
      })
      .addCase(markMessageSeen.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { receiveMessage, setSelectedUser } = messageSlice.actions;
export default messageSlice.reducer;
