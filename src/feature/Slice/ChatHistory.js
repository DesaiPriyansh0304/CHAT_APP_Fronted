// feature/Slice/ChatHistory.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = import.meta.env.VITE_REACT_APP;

// Fetch chat history
export const fetchChatHistory = createAsyncThunk(
  "chat/fetchChatHistory",
  async ({ userId1, userId2, groupId, page = 1 }, { rejectWithValue }) => {
    try {
      const params = groupId ? { groupId, page } : { userId1, userId2, page };

      // console.log("Params =>", params);
      const { data } = await axios.get(`${URL}/api/msg/chat-history`, {
        params,
      });
      console.log("Fetched chatHistory:", data.chatHistory);
      return {
        messages: data.chatHistory,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalMessages: data.totalMessages,
      };
    } catch (error) {
      console.error("❌ Chat history fetch error:", error);
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.loadingHistory = true;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        const { messages, currentPage, totalPages, totalMessages } =
          action.payload;
        // console.log("messages --->", messages);
        // console.log("Fulfilled reducer payload:", action.payload);

        const flattenedMessages = messages.map((msg) => {
          // console.log("✌️msg --->", msg);
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

          // console.log("✌️senderId --->", senderId);
          // console.log("✌️receiverId --->", receiverId);
          return {
            ...msg,
            senderId, // string
            receiverId, // string
            senderEmail,
            receiverEmail,
            text: msg.text || "",
            content: msg.content || "",
            type: msg.type || "text",
          };
        });
        // console.log("✌️flattenedMessages --->", flattenedMessages);
        // console.log(" Flattened Messages:", flattenedMessages);

        if (currentPage > 1) {
          state.messages = [...flattenedMessages, ...state.messages];
        } else {
          state.messages = flattenedMessages;
        }

        // console.log(" Final state.messages in reducer:", state.messages);

        state.currentPage = currentPage;
        state.totalPages = totalPages;
        state.totalMessages = totalMessages;
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
