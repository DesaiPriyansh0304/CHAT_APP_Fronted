import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = import.meta.env.VITE_REACT_APP;

export const fetchChatHistory = createAsyncThunk(
  "chat/fetchChatHistory",
  async ({ userId1, userId2, groupId, page = 1 }, { rejectWithValue }) => {
    try {
      const params = groupId ? { groupId, page } : { userId1, userId2, page };
      const { data } = await axios.get(`${URL}/api/msg/chat-history`, {
        params,
      });

      console.log("📨 API Response:", {
        messagesCount: data.chatHistory?.length || 0,
        isGroup: !!groupId,
        page,
        totalPages: data.totalPages,
        groupUsers: data.groupUsers?.length || 0,
        sampleMessage: data.chatHistory?.[0],
      });

      return {
        messages: data.chatHistory || [],
        currentPage: data.currentPage || 1,
        totalPages: data.totalPages || 1,
        totalMessages: data.totalMessages || 0,
        sender: data.sender || null,
        receiver: data.receiver || null,
        groupUsers: data.groupUsers || [],
        isGroupChat: !!groupId,
        currentGroupId: groupId || null,
      };
    } catch (error) {
      console.error("Fetch chat history error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const chatHistorySlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    loadingHistory: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalMessages: 0,
    sender: null,
    receiver: null,
    groupUsers: [],
    searchQuery: "",
    isGroupChat: false,
    currentGroupId: null,
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addOwnMessage: (state, action) => {
      const newMessage = {
        ...action.payload,
        messageId:
          action.payload.messageId ||
          action.payload._id ||
          Date.now().toString(),
        createdAt: action.payload.createdAt || new Date().toISOString(),
        // ✅ Group messages માટે special handling
        receiverId: action.payload.groupId ? null : action.payload.receiverId,
        isGroupMessage: !!action.payload.groupId,
      };
      state.messages.push(newMessage);
      console.log("➕ Added new message:", {
        messageId: newMessage.messageId,
        isGroup: !!newMessage.groupId,
        senderId: newMessage.senderId,
        receiverId: newMessage.receiverId,
      });
    },
    addIncomingMessage: (state, action) => {
      const incomingMessage = {
        ...action.payload,
        messageId:
          action.payload.messageId ||
          action.payload._id ||
          Date.now().toString(),
        createdAt: action.payload.createdAt || new Date().toISOString(),
        receiverId: action.payload.groupId ? null : action.payload.receiverId,
        isGroupMessage: !!action.payload.groupId,
      };

      // Avoid duplicates
      const exists = state.messages.some(
        (msg) => msg.messageId === incomingMessage.messageId
      );

      if (!exists) {
        state.messages.push(incomingMessage);
        console.log("📨 Added incoming message:", {
          messageId: incomingMessage.messageId,
          isGroup: !!incomingMessage.groupId,
          senderId: incomingMessage.senderId,
        });
      }
    },
    clearMessages: (state) => {
      state.messages = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalMessages = 0;
      state.error = null;
      state.sender = null;
      state.receiver = null;
      state.groupUsers = [];
      state.isGroupChat = false;
      state.currentGroupId = null;
    },
    addMessagesToTop: (state, action) => {
      state.messages = [...action.payload, ...state.messages];
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    markMessageAsRead: (state, action) => {
      const messageId = action.payload;
      state.messages = state.messages.map((msg) =>
        msg.messageId === messageId ? { ...msg, isRead: true } : msg
      );
    },
    updateGroupUsers: (state, action) => {
      state.groupUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.loadingHistory = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        const {
          messages,
          currentPage,
          totalPages,
          totalMessages,
          sender,
          receiver,
          groupUsers,
          isGroupChat,
          currentGroupId,
        } = action.payload;

        // ✅ Enhanced message processing - Group messages માટે special handling
        const processedMessages = messages.map((msg) => {
          const senderId =
            typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;
          const receiverId =
            typeof msg.receiverId === "object"
              ? msg.receiverId._id
              : msg.receiverId;
          const groupId =
            typeof msg.groupId === "object" ? msg.groupId._id : msg.groupId;

          const senderEmail =
            typeof msg.senderId === "object" ? msg.senderId.email : "";
          const receiverEmail =
            typeof msg.receiverId === "object" ? msg.receiverId.email : "";

          // ✅ Group messages માટે logic:
          // જો API response માં groupId નથી, પણ આપણે group chat fetch કર્યો છે,
          // તો assume કરો કે આ group message છે
          const finalGroupId = groupId || (isGroupChat ? currentGroupId : null);
          const isGroupMessage = isGroupChat || !!finalGroupId;
          const finalReceiverId = isGroupMessage ? null : receiverId;

          return {
            ...msg,
            senderId,
            receiverId: finalReceiverId,
            groupId: finalGroupId,
            senderEmail,
            receiverEmail,
            isGroupMessage,
            text: msg.text || msg.textMessage || "",
            content: Array.isArray(msg.content)
              ? msg.content
              : msg.content
                ? [msg.content]
                : [],
            type: msg.type || "text",
            isRead: msg.isRead || false,
            messageId: msg.messageId || msg._id || Date.now().toString(),
            createdAt: msg.createdAt || new Date().toISOString(),
          };
        });

        // Messages replacement logic
        if (currentPage === 1) {
          state.messages = processedMessages;
        } else {
          // For pagination, add older messages to the top
          const existingIds = new Set(state.messages.map((m) => m.messageId));
          const newMessages = processedMessages.filter(
            (m) => !existingIds.has(m.messageId)
          );
          state.messages = [...newMessages, ...state.messages];
        }

        state.currentPage = currentPage;
        state.totalPages = totalPages;
        state.totalMessages = totalMessages;
        state.sender = sender || null;
        state.receiver = receiver || null;
        state.groupUsers = groupUsers || [];
        state.isGroupChat = isGroupChat;
        state.currentGroupId = currentGroupId;
        state.loadingHistory = false;
        state.error = null;

        console.log("✅ Messages loaded successfully:", {
          total: processedMessages.length,
          isGroup: isGroupChat,
          currentGroupId,
          page: currentPage,
          groupUsers: groupUsers?.length || 0,
          sampleProcessedMessage: processedMessages[0]
            ? {
                messageId: processedMessages[0].messageId,
                senderId: processedMessages[0].senderId,
                groupId: processedMessages[0].groupId,
                receiverId: processedMessages[0].receiverId,
                isGroupMessage: processedMessages[0].isGroupMessage,
                text: processedMessages[0].text?.substring(0, 30),
              }
            : null,
        });
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.error = action.payload;
        state.loadingHistory = false;
        console.error("❌ Failed to load messages:", action.payload);
      });
  },
});

export const {
  setMessages,
  addOwnMessage,
  addIncomingMessage,
  clearMessages,
  addMessagesToTop,
  setSearchQuery,
  markMessageAsRead,
  updateGroupUsers,
} = chatHistorySlice.actions;

// ✅ Enhanced selector with better filtering
export const selectFilteredMessages = (state) => {
  const { messages, searchQuery } = state.chatHistory;

  if (!searchQuery) {
    // Sort messages by creation date
    return [...messages].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  }

  const lower = searchQuery.toLowerCase();
  return messages
    .filter(
      (msg) =>
        (msg.text || "").toLowerCase().includes(lower) ||
        (msg.content || []).some(
          (content) =>
            content && content.toString().toLowerCase().includes(lower)
        )
    )
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

// ✅ Additional selectors for better state management
export const selectChatState = (state) => state.chatHistory;
export const selectIsGroupChat = (state) => state.chatHistory.isGroupChat;
export const selectGroupUsers = (state) => state.chatHistory.groupUsers;
export const selectCurrentPage = (state) => state.chatHistory.currentPage;
export const selectTotalPages = (state) => state.chatHistory.totalPages;
export const selectLoadingHistory = (state) => state.chatHistory.loadingHistory;
export const selectCurrentGroupId = (state) => state.chatHistory.currentGroupId;

export default chatHistorySlice.reducer;
