import { combineReducers } from "@reduxjs/toolkit";

// Auth-reducers
import authReducer from "./Auth/AuthSlice";
import loginuserReducer from "./Auth/LoginUserSlice";

// User-related reducers
import userReducer from "./FetchUserdata";
import searchUserReducer from "./SearchUserSlice";
import favoriteReducer from "./favoriteSlice";
import invitedUsersReducer from "./Invited-User/InvitedUsersSlice";

// Chat-related reducers
import chatReducer from "./ChatSlice";
import chatHistoryReducer from "./Chat/ChatHistory";
import getUserReducer from "./GetUserMessage";
import markAsReadReducer from "./MarkSlice";
import userGroupsReducer from "./Group/UserGroup";

// Socket & Online
import socketReducer from "./Socket/SocketSlice";
import onlineUsersReducer from "./Socket/OnlineuserSlice"; // same slice used

// Group-related reducers
import groupActionReducer from "./Group/DeleteGroup";
import filteredInvitedUsersReducer from "./Invited-User/FilteredInvitedUsers";

// Theme
import themeReducer from "./Theme/ThemeSlice";
import unreadCountReducer from "./Socket/unreadCountSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  loginuser: loginuserReducer,

  users: userReducer,
  searchUser: searchUserReducer,
  favorite: favoriteReducer,
  invitedUsers: invitedUsersReducer,
  chat: chatReducer,
  chatHistory: chatHistoryReducer,
  getUserMessage: getUserReducer,
  markAsRead: markAsReadReducer,
  userGroups: userGroupsReducer,
  socket: socketReducer,
  onlineUsers: onlineUsersReducer,
  groupAction: groupActionReducer,
  filteredInvitedUsers: filteredInvitedUsersReducer,
  theme: themeReducer,
  unreadCount: unreadCountReducer,
});

export default rootReducer;
