import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { setOnlineUsers } from "../Socket/OnlineuserSlice";
import { newMessageReceived } from "../ChatSlice";
import { setUnreadCount } from "../Socket/unreadCountSlice";

import {
  setChatListLoading,
  setChatList,
  updateChatList,
  setChatListError,
  updateChatUnreadCount,
  updateLastMessage,
} from "../Socket/chatListSlice";

const URL = import.meta.env.VITE_REACT_APP;
// console.log("URL --->Socket Slice", URL);
let socketInstance = null;

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: null,
    isConnected: false,
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    clearSocket: (state) => {
      state.socket = null;
      state.isConnected = false;
    },
  },
});

export const { setSocket, setConnectionStatus, clearSocket } =
  socketSlice.actions;

export const connectSocket = (user) => (dispatch) => {
  //Login user sata(user)
  console.log("User received in connectSocket:", user);

  if (!user || socketInstance?.connected) {
    console.log("Socket already connected or user missing/SocketSlice", {
      hasUser: !!user,
      socketConnected: socketInstance?.connected,
    });
    return;
  }

  // console.log("Connecting socket to:/SocketSlice", URL); //localhost path backend
  // console.log("👤 Connecting with userId:/SocketSlice", user._id); login userdata user_id

  socketInstance = io(URL, {
    query: {
      userId: user._id || user.userId,
    },
    transports: ["websocket"],
  });

  //connect to socket
  socketInstance.on("connect", () => {
    console.log("🟢Socket connected:/SocketSlice", socketInstance.id);
    dispatch(setSocket(socketInstance));
    dispatch(setConnectionStatus(true));

    // 🆕 Connection true - chat list fetch
    console.log("📋 Requesting chat list after connection...");
    socketInstance.emit("getChatList");
  });

  socketInstance.emit("openChatWith", {
    userId: user._id || user.userId,
    chatWithUserId: null,
  });

  //connection Error
  socketInstance.on("connect_error", (err) => {
    console.log("⚫Socket connection error:/SocketSlice", err.message);
    dispatch(setConnectionStatus(false));
  });
  //Socket Disconnection
  socketInstance.on("disconnect", () => {
    console.log("🔴Socket disconnected/SocketSlice");
    dispatch(setConnectionStatus(false));
  });
  //Online User Id
  socketInstance.on("getOnlineUsers", (userIds) => {
    // console.log(
    //   "🔵 Online users received/SocketSlice/ (count):",
    //   userIds.length
    // );
    console.log(" Online users received:", userIds);
    dispatch(setOnlineUsers(userIds));
  });

  socketInstance.on("unreadCountUpdate", (data) => {
    console.log("📊 Unread count received:", data);
    dispatch(setUnreadCount(data));
  });

  // 🆕 Chat List Events
  socketInstance.on("chatListResponse", (data) => {
    console.log("📋 Chat list response received:/SocketSlice", data);

    if (data.success) {
      dispatch(
        setChatList({
          chats: data.chats,
          totalChats: data.totalChats,
        })
      );
      console.log(
        "✅ Chat list loaded successfully:",
        data.totalChats,
        "chats"
      );
    } else {
      dispatch(setChatListError(data.error || "Failed to fetch chat list"));
      console.log("Chat list fetch error:", data.error);
    }
  });

  socketInstance.on("chatListUpdated", (data) => {
    console.log("🔄 Real-time chat list update received:/SocketSlice", data);

    if (data.success) {
      dispatch(
        updateChatList({
          chats: data.chats,
          totalChats: data.totalChats,
        })
      );
      console.log(
        "✅ Chat list updated in real-time:",
        data.totalChats,
        "chats"
      );
    }
  });

  // Unread count updates
  socketInstance.on("unreadCountUpdated", (data) => {
    console.log("📊 Unread count updated:/SocketSlice", data);

    dispatch(
      updateChatUnreadCount({
        conversationId: data.conversationId,
        newCount: data.newCount,
      })
    );
  });

  socketInstance.on("groupMessage", (message) => {
    console.log("👥 Group message received:/SocketSlice", message);

    // Message dispatch
    dispatch(
      newMessageReceived({
        ...message,
        text: message.text || "",
        image: message.image || "",
        file: message.file || "",
        type: message.type || "text",
      })
    );

    // Chat list last message update
    if (message.groupId) {
      dispatch(
        updateLastMessage({
          conversationId: message.conversationId,
          lastMessage: {
            text: message.text || "Media file",
            type: message.type,
            time: message.createdAt || new Date().toISOString(),
            senderId: message.senderId,
          },
        })
      );
    }
  });

  //private Message
  socketInstance.on("privateMessage", (message) => {
    console.log("📩 Private message received:/SocketSlice", message);

    const currentUserId = user._id || user.userId;
    const content = Array.isArray(message.content)
      ? message.content[0]
      : message.content;

    if (message.receiverId === currentUserId) {
      // Message dispatch
      dispatch(
        newMessageReceived({
          ...message,
          content: message.content || [],
          text: message.text || "",
          image: message.type === "image" ? content : "",
          file: message.type === "file" ? content : "",
          type: message.type || "text",
        })
      );

      // Chat list last message update
      dispatch(
        updateLastMessage({
          conversationId: message.conversationId,
          lastMessage: {
            text: message.text || "Media file",
            type: message.type,
            time: message.createdAt || new Date().toISOString(),
            senderId: message.senderId,
          },
        })
      );
    }
  });

  // handle reconnection
  socketInstance.io.on("reconnect", () => {
    console.log("🔁 Reconnected to socket server!/SocketSlice");

    // Reconnect - chat list refresh
    console.log("📋 Refreshing chat list after reconnection...");
    socketInstance.emit("getChatList");
  });
};

// Chat list fetch action
export const fetchChatList = () => (dispatch) => {
  if (socketInstance && socketInstance.connected) {
    console.log("📋 Requesting chat list...");
    dispatch(setChatListLoading(true));
    socketInstance.emit("getChatList");
  } else {
    console.log(" Socket not connected, cannot fetch chat list");
    dispatch(setChatListError("Socket not connected"));
  }
};

// Chat refresh
export const refreshChatList = () => (dispatch) => {
  console.log("Manually refreshing chat list...");
  dispatch(fetchChatList());
};

//mark message
export const markMessagesAsRead =
  ({ senderId, receiverId }) =>
  () => {
    if (socketInstance && socketInstance.connected) {
      console.log("Emitting markMessagesAsRead to backend", {
        senderId,
        receiverId,
      });
      socketInstance.emit("markMessagesAsRead", { senderId, receiverId });
    }
  };

console.log("Socket instance: ", socketInstance?.connected);

export const disconnectSocket = () => (dispatch) => {
  if (socketInstance) {
    console.log("🔌Disconnecting socket.../SocketSlice");
    socketInstance.disconnect();
    socketInstance = null;
    dispatch(clearSocket());
    dispatch(setOnlineUsers([]));
  }
};

export default socketSlice.reducer;
