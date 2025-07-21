import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { setOnlineUsers } from "./OnlineuserSlice";
import { newMessageReceived } from "./ChatSlice";

const URL = import.meta.env.VITE_REACT_APP;
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
  //socket connection and  connected or user missing
  if (!user || socketInstance?.connected) {
    console.log("⚠️ Socket already connected or user missing/SocketSlice", {
      hasUser: !!user,
      socketConnected: socketInstance?.connected,
    });
    return;
  }

  console.log("🌐 Connecting socket to:/SocketSlice", URL);
  console.log(
    "👤 Connecting with userId:/SocketSlice",
    user._id || user.userId
  );

  socketInstance = io(URL, {
    query: {
      userId: user._id || user.userId,
    },
    transports: ["websocket"],
  });

  socketInstance.on("connect", () => {
    console.log("🟢Socket connected:/SocketSlice", socketInstance.id);
    dispatch(setSocket(socketInstance));
    dispatch(setConnectionStatus(true));
  });

  socketInstance.emit("openChatWith", {
    userId: user._id || user.userId,
    chatWithUserId: null, // initially no chat open
  });

  socketInstance.on("connect_error", (err) => {
    console.error("⚫Socket connection error:/SocketSlice", err.message);
    dispatch(setConnectionStatus(false));
  });

  socketInstance.on("disconnect", () => {
    console.log("🔴Socket disconnected/SoketSlice");
    dispatch(setConnectionStatus(false));
  });

  socketInstance.on("getOnlineUsers", (userIds) => {
    console.log(
      "🔵 Online users received/SocketSlice/ (count):",
      userIds.length
    );
    console.log(" Online users received:", userIds);
    dispatch(setOnlineUsers(userIds));
  });

  socketInstance.on("groupMessage", (message) => {
    console.log("👥 Group message received:/SocketSlice", message);
    dispatch(
      newMessageReceived({
        ...message,
        text: message.text || "",
        image: message.image || "",
        file: message.file || "",
        type: message.type || "text",
      })
    );
  });

  socketInstance.on("privateMessage", (message) => {
    console.log("📩 Private message received:/SocketSlice", message);
    // dispatch(newMessageReceived(message));
    const currentUserId = user._id || user.userId;
    const content = Array.isArray(message.content)
      ? message.content[0]
      : message.content;

    if (message.receiverId === currentUserId) {
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
    }
  });

  // handle reconnection
  socketInstance.io.on("reconnect", () => {
    console.log("🔁 Reconnected to socket server!/SocketSlice");
  });
};

export const markMessagesAsRead =
  ({ senderId, receiverId }) =>
  () => {
    if (socketInstance && socketInstance.connected) {
      console.log("✅ Emitting markMessagesAsRead to backend", {
        senderId,
        receiverId,
      });
      socketInstance.emit("markMessagesAsRead", { senderId, receiverId });
    }
  };

//disconnnected SOCKET.IO
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
