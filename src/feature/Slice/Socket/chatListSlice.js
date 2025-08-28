import { createSlice } from "@reduxjs/toolkit";

const chatListSlice = createSlice({
  name: "chatList",
  initialState: {
    chats: [],
    loading: false,
    error: null,
    lastUpdated: null,
    totalChats: 0,
  },
  reducers: {
    setChatListLoading: (state, action) => {
      state.loading = action.payload;
    },
    setChatList: (state, action) => {
      const { chats, totalChats } = action.payload;
      state.chats = chats;
      state.totalChats = totalChats;
      state.loading = false;
      state.error = null;
      state.lastUpdated = new Date().toISOString();
      console.log("🔵 Chat list updated in Redux:", chats.length, "chats");
    },
    updateChatList: (state, action) => {
      const { chats, totalChats } = action.payload;
      state.chats = chats;
      state.totalChats = totalChats;
      state.lastUpdated = new Date().toISOString();
      console.log("🔄 Chat list real-time updated:", chats.length, "chats");
    },
    setChatListError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      console.log("❌ Chat list error:", action.payload);
    },
    clearChatList: (state) => {
      state.chats = [];
      state.totalChats = 0;
      state.loading = false;
      state.error = null;
      state.lastUpdated = null;
      console.log("🗑️ Chat list cleared");
    },
    // Specific chat ની unread count update કરવા માટે
    updateChatUnreadCount: (state, action) => {
      const { conversationId, newCount } = action.payload;
      const chatIndex = state.chats.findIndex(
        (chat) => chat.conversationId === conversationId
      );

      if (chatIndex !== -1) {
        state.chats[chatIndex].unreadCount = newCount;
        console.log(
          `📊 Updated unread count for chat ${conversationId}: ${newCount}`
        );
      }
    },
    // Last message update કરવા માટે
    updateLastMessage: (state, action) => {
      const { conversationId, lastMessage } = action.payload;
      const chatIndex = state.chats.findIndex(
        (chat) => chat.conversationId === conversationId
      );

      if (chatIndex !== -1) {
        state.chats[chatIndex].lastMessage = lastMessage;
        state.chats[chatIndex].updatedAt = lastMessage.time;

        // Re-sort chats by last message time
        state.chats.sort((a, b) => {
          const timeA = a.lastMessage
            ? new Date(a.lastMessage.time)
            : new Date(a.updatedAt);
          const timeB = b.lastMessage
            ? new Date(b.lastMessage.time)
            : new Date(b.updatedAt);
          return timeB - timeA;
        });

        console.log(`💬 Updated last message for chat ${conversationId}`);
      }
    },
  },
});

export const {
  setChatListLoading,
  setChatList,
  updateChatList,
  setChatListError,
  clearChatList,
  updateChatUnreadCount,
  updateLastMessage,
} = chatListSlice.actions;

// Selectors
export const selectChatList = (state) => state.chatList.chats;
export const selectChatListLoading = (state) => state.chatList.loading;
export const selectChatListError = (state) => state.chatList.error;
export const selectTotalChats = (state) => state.chatList.totalChats;
export const selectChatListLastUpdated = (state) => state.chatList.lastUpdated;

// Specific chat find કરવા માટે
export const selectChatById = (conversationId) => (state) =>
  state.chatList.chats.find((chat) => chat.conversationId === conversationId);

export default chatListSlice.reducer;
