import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ API થી unread messages fetch કરવા માટે
export const fetchUnreadMessages = createAsyncThunk(
  "unreadMessages/fetchUnreadMessages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/unread-messages"); // તમારા API endpoint
      console.log("📨 Unread Messages API Response:", response.data);

      // Backend response ને process કરીએ
      const chatWiseCount = {};
      let totalCount = 0;

      if (Array.isArray(response.data)) {
        response.data.forEach((conversation) => {
          const userId = conversation.user?._id;
          const unreadCount = conversation.unreadMessageCount || 0;

          if (userId && unreadCount > 0) {
            chatWiseCount[userId] = unreadCount;
            totalCount += unreadCount;
          }
        });
      }

      return { chatWiseCount, totalCount };
    } catch (error) {
      console.error("❌ Error fetching unread messages:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Messages ને read mark કરવા માટે API call
export const markMessagesAsRead = createAsyncThunk(
  "unreadMessages/markAsRead",
  async ({ senderId, receiverId }, { getState, rejectWithValue }) => {
    try {
      const socket = getState().socket?.socket;

      if (socket && socket.connected) {
        console.log("📤 Emitting markMessagesAsRead:", {
          senderId,
          receiverId,
        });

        // Socket event emit કરીએ
        socket.emit("markMessagesAsRead", { senderId, receiverId });

        // API call પણ કરીએ જો જરૂર હોય
        // await axios.post('/api/mark-messages-read', { senderId, receiverId });

        return { receiverId };
      } else {
        console.error("❌ Socket not connected");
        return rejectWithValue("Socket not connected");
      }
    } catch (error) {
      console.error("❌ Error marking messages as read:", error);
      return rejectWithValue(error.message);
    }
  }
);

const unreadCountSlice = createSlice({
  name: "unreadCount",
  initialState: {
    totalCount: 0,
    chatWiseCount: {},
    lastUpdated: null,
    loading: false,
    error: null,
  },
  reducers: {
    // ✅ Manual count set કરવા માટે
    setUnreadCount: (state, action) => {
      const { totalCount, chatWiseCount } = action.payload;
      state.totalCount = totalCount || 0;
      state.chatWiseCount = chatWiseCount || {};
      state.lastUpdated = new Date().toISOString();
      console.log("📊 Updated unread counts:", {
        totalCount: state.totalCount,
        chatWiseCount: state.chatWiseCount,
      });
    },

    // ✅ નવો message આવે તો count વધારવા માટે
    incrementUnreadCount: (state, action) => {
      const { chatId, count = 1 } = action.payload;

      if (!chatId) {
        console.warn("⚠️ No chatId provided for incrementUnreadCount");
        return;
      }

      if (!state.chatWiseCount[chatId]) {
        state.chatWiseCount[chatId] = 0;
      }

      state.chatWiseCount[chatId] += count;
      state.totalCount += count;
      state.lastUpdated = new Date().toISOString();

      console.log(
        `📈 Incremented unread count for ${chatId}: +${count}, Total: ${state.totalCount}`
      );
    },

    // ✅ મુખ્ય function - specific chat ના unread count reset કરવા માટે
    resetChatUnreadCount: (state, action) => {
      const chatId = action.payload;

      if (!chatId) {
        console.warn("⚠️ No chatId provided for resetChatUnreadCount");
        return;
      }

      const previousCount = state.chatWiseCount[chatId] || 0;

      if (previousCount > 0) {
        // Total count માંથી આ chat ના count minus કરીએ
        state.totalCount -= previousCount;

        // Chat specific count 0 કરીએ
        delete state.chatWiseCount[chatId];

        state.lastUpdated = new Date().toISOString();

        console.log(
          `🔄 Reset unread count for ${chatId}: -${previousCount}, Total: ${state.totalCount}`
        );
      } else {
        console.log(`ℹ️ No unread messages found for ${chatId}`);
      }
    },

    // ✅ બધા unread counts clear કરવા માટે
    clearAllUnreadCount: (state) => {
      const previousTotal = state.totalCount;
      state.totalCount = 0;
      state.chatWiseCount = {};
      state.lastUpdated = new Date().toISOString();
      console.log(`🗑️ Cleared all unread counts: -${previousTotal}`);
    },

    // ✅ Error clear કરવા માટે
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUnreadMessages cases
      .addCase(fetchUnreadMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnreadMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.totalCount = action.payload.totalCount;
        state.chatWiseCount = action.payload.chatWiseCount;
        state.lastUpdated = new Date().toISOString();
        console.log("✅ Fetched unread messages successfully:", action.payload);
      })
      .addCase(fetchUnreadMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch unread messages";
        console.error("❌ Failed to fetch unread messages:", action.payload);
      })
      // markMessagesAsRead cases
      .addCase(markMessagesAsRead.pending, (state) => {
        console.log("✌️state --->", state);
        // કોઈ loading state નથી જોઈતી કારણ કે આ background operation છે
      })
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        const { receiverId } = action.payload;

        // જો success થયું હોય તો count reset કરીએ
        if (receiverId && state.chatWiseCount[receiverId]) {
          const count = state.chatWiseCount[receiverId];
          state.totalCount -= count;
          delete state.chatWiseCount[receiverId];
          state.lastUpdated = new Date().toISOString();
          console.log(
            `✅ Messages marked as read for ${receiverId}: -${count}`
          );
        }
      })
      .addCase(markMessagesAsRead.rejected, (state, action) => {
        state.error = action.payload || "Failed to mark messages as read";
        console.error("❌ Failed to mark messages as read:", action.payload);
      });
  },
});

// ✅ Actions export
export const {
  setUnreadCount,
  incrementUnreadCount,
  resetChatUnreadCount,
  clearAllUnreadCount,
  clearError,
} = unreadCountSlice.actions;

// ✅ Selectors
export const selectTotalUnreadCount = (state) =>
  state.unreadCount?.totalCount || 0;
export const selectChatUnreadCount = (chatId) => (state) =>
  state.unreadCount?.chatWiseCount?.[chatId] || 0;
export const selectAllChatWiseCounts = (state) =>
  state.unreadCount?.chatWiseCount || {};
export const selectUnreadLoading = (state) =>
  state.unreadCount?.loading || false;
export const selectUnreadError = (state) => state.unreadCount?.error;

export default unreadCountSlice.reducer;
