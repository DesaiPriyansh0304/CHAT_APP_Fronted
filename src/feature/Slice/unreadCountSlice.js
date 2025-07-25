import { createSlice } from "@reduxjs/toolkit";

const unreadCountSlice = createSlice({
  name: "unreadCount",
  initialState: {
    totalCount: 0,
    chatWiseCount: {},
    lastUpdated: null,
  },
  reducers: {
    setUnreadCount: (state, action) => {
      const { totalCount, chatWiseCount } = action.payload;
      state.totalCount = totalCount;
      state.chatWiseCount = chatWiseCount;
      state.lastUpdated = new Date().toISOString();
    },

    incrementUnreadCount: (state, action) => {
      const { chatId } = action.payload;
      if (!state.chatWiseCount[chatId]) {
        state.chatWiseCount[chatId] = 0;
      }
      state.chatWiseCount[chatId] += 1;
      state.totalCount += 1;
    },

    resetChatUnreadCount: (state, action) => {
      const chatId = action.payload;
      const count = state.chatWiseCount[chatId];
      if (count) {
        state.totalCount -= count;
        delete state.chatWiseCount[chatId];
      }
    },

    clearAllUnreadCount: (state) => {
      state.totalCount = 0;
      state.chatWiseCount = {};
      state.lastUpdated = null;
    },
  },
});

// ✅ Export missing reducer here:
export const {
  setUnreadCount,
  incrementUnreadCount, // ✅ now exported correctly
  resetChatUnreadCount,
  clearAllUnreadCount,
} = unreadCountSlice.actions;

// ✅ Selectors
export const selectTotalUnreadCount = (state) => state.unreadCount.totalCount;
export const selectChatUnreadCount = (chatId) => (state) =>
  state.unreadCount.chatWiseCount[chatId] || 0;
export const selectAllChatWiseCounts = (state) =>
  state.unreadCount.chatWiseCount;

export default unreadCountSlice.reducer;
