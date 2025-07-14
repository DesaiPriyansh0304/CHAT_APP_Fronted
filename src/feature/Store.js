import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/Slice/AuthSlice";
import checkAuthReducer from "../feature/Slice/GetuserSlice";
import updateProfileReducer from "../feature/Slice/Updateprofile";
import socketReducer from "../feature/Slice/SocketSlice";
import getUserReducer from "../feature/Slice/GetUserMessage";
import userReducer from "../feature/Slice/FetchUserdata";
import markmessagesReducer from "../feature/Slice/MarkSlice";
import chatReducer from "../feature/Slice/ChatSlice";
import onlineUsersReducer from "../feature/Slice/OnlineuserSlice";
import chatHistoryReducer from "../feature/Slice/ChatHistory";
import userGroupsReducer from "../feature/Slice/UserGroup";
import loginuserReducer from "../feature/Slice/LoginUserSlice";
import favoriteReducer from "../feature/Slice/favoriteSlice";
import invitedUsersReducer from "../feature/Slice/InvitedUsersSlice";
import searchUserReducer from "../feature/Slice/SearchUserSlice";
import filteredInvitedUsersReducer from "../feature/Slice/FilteredInvitedUsers";

const store = configureStore({
  reducer: {
    //user store data
    auth: authReducer,
    checkAuth: checkAuthReducer,
    updateProfile: updateProfileReducer,
    //soket Slice
    socket: socketReducer,
    onlineUsers: onlineUsersReducer, //online user data
    chat: chatReducer,
    // message slices
    getUserMessage: getUserReducer,
    users: userReducer,
    // sendmessages: sendReducer,
    markmessages: markmessagesReducer,
    chatHistory: chatHistoryReducer,
    //Group
    userGroups: userGroupsReducer,
    loginuser: loginuserReducer,
    searchUser: searchUserReducer,
    //favorite Item
    favorite: favoriteReducer,
    //User Data Slice
    filteredInvitedUsers: filteredInvitedUsersReducer, //filter in user data
    invitedUsers: invitedUsersReducer, //invited user and invited by use data
  },
});

export default store;
