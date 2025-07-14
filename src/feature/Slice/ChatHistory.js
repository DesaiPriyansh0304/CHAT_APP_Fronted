import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = import.meta.env.VITE_REACT_APP;

// Fetch chat history
export const fetchChatHistory = createAsyncThunk(
  "chat/fetchChatHistory",
  async ({ userId1, userId2, groupId, page = 1 }, { rejectWithValue }) => {
    try {
      const params = groupId ? { groupId, page } : { userId1, userId2, page };

      const { data } = await axios.get(`${URL}/api/msg/chat-history`, {
        params,
      });
      // console.log("✅data --->/Chathistory", data);

      return {
        messages: data.chatHistory,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalMessages: data.totalMessages,
        sender: data.sender || null,
        receiver: data.receiver || null,
        groupUsers: data.groupUsers || [],
      };
    } catch (error) {
      console.error("❌Chat history fetch error:", error);
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
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addOwnMessage: (state, action) => {
      state.messages.push(action.payload);
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
    },
    addMessagesToTop: (state, action) => {
      state.messages = [...action.payload, ...state.messages];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.loadingHistory = true;
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
        } = action.payload;

        const flattenedMessages = messages.map((msg) => {
          const senderId =
            typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;
          const receiverId =
            typeof msg.receiverId === "object"
              ? msg.receiverId._id
              : msg.receiverId;
          const senderEmail =
            typeof msg.senderId === "object" ? msg.senderId.email : "";
          const receiverEmail =
            typeof msg.receiverId === "object" ? msg.receiverId.email : "";

          return {
            ...msg,
            senderId,
            receiverId,
            senderEmail,
            receiverEmail,
            text: msg.text || "",
            content: msg.content || "",
            type: msg.type || "text",
          };
        });

        if (currentPage > 1) {
          state.messages = [...flattenedMessages, ...state.messages];
        } else {
          state.messages = flattenedMessages;
        }

        state.currentPage = currentPage;
        state.totalPages = totalPages;
        state.totalMessages = totalMessages;
        state.sender = sender || null;
        state.receiver = receiver || null;
        state.groupUsers = groupUsers || [];
        state.loadingHistory = false;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.error = action.payload;
        state.loadingHistory = false;
      });
  },
});

export const { setMessages, addOwnMessage, clearMessages } =
  chatHistorySlice.actions;

export default chatHistorySlice.reducer;
