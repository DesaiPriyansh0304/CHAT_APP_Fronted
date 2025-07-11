import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/Slice/AuthSlice";
import checkAuthReducer from "../feature/Slice/GetuserSlice";
import updateProfileReducer from "../feature/Slice/Updateprofile";
import socketReducer from "../feature/Slice/SocketSlice";
import getUserReducer from "../feature/Slice/GetUserMessage";
import userReducer from "../feature/Slice/FetchUserdata";
// import sendReducer from "../feature/Slice/SendMessage";
import markmessagesReducer from "../feature/Slice/MarkSlice";
import chatReducer from "../feature/Slice/ChatSlice";
import onlineUsersReducer from "../feature/Slice/OnlineuserSlice";
import chatHistoryReducer from "../feature/Slice/ChatHistory";
import userGroupsReducer from "../feature/Slice/UserGroup";
import loginuserReducer from "../feature/Slice/LoginUserSlice";
import favoriteReducer from "../feature/Slice/favoriteSlice";
import invitedUsersReducer from "../feature/Slice/InvitedUsersSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    checkAuth: checkAuthReducer,
    updateProfile: updateProfileReducer,
    socket: socketReducer,
    // message slices
    getUserMessage: getUserReducer,
    users: userReducer,
    // sendmessages: sendReducer,
    markmessages: markmessagesReducer,
    chat: chatReducer,
    onlineUsers: onlineUsersReducer,
    chatHistory: chatHistoryReducer,
    userGroups: userGroupsReducer,
    loginuser: loginuserReducer,

    favorite: favoriteReducer,
    invitedUsers: invitedUsersReducer,
    //Group
  },
});

export default store;
