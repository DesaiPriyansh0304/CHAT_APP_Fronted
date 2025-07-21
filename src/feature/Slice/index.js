import { combineReducers } from '@reduxjs/toolkit';

// Auth-reducers
import authReducer from './Auth/AuthSlice';
import loginuserReducer from './Auth/LoginUserSlice';

// User-related reducers
// import checkAuthReducer from "./GetuserSlice";
// import updateProfileReducer from "./Updateprofile";
import userReducer from './FetchUserdata';
import searchUserReducer from './SearchUserSlice';
import favoriteReducer from './favoriteSlice';
import invitedUsersReducer from './Invited-User/InvitedUsersSlice';

// Chat-related reducers
import chatReducer from './ChatSlice';
import chatHistoryReducer from './Chat/ChatHistory';
import getUserReducer from './GetUserMessage';
import markmessagesReducer from './MarkSlice';
import userGroupsReducer from './Group/UserGroup';

// Socket & Online
import socketReducer from './Socket/SocketSlice';
import onlineUsersReducer from './Socket/OnlineuserSlice'; // same slice used

// Group-related reducers
import groupActionReducer from './Group/DeleteGroup';
import filteredInvitedUsersReducer from './Invited-User/FilteredInvitedUsers';

// Theme
import themeReducer from './Theme/ThemeSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  loginuser: loginuserReducer,
  // checkAuth: checkAuthReducer,
  // updateProfile: updateProfileReducer,
  users: userReducer,
  searchUser: searchUserReducer,
  favorite: favoriteReducer,
  invitedUsers: invitedUsersReducer,
  chat: chatReducer,
  chatHistory: chatHistoryReducer,
  getUserMessage: getUserReducer,
  markmessages: markmessagesReducer,
  userGroups: userGroupsReducer,
  socket: socketReducer,
  onlineUsers: onlineUsersReducer,
  groupAction: groupActionReducer,
  filteredInvitedUsers: filteredInvitedUsersReducer,
  theme: themeReducer,
});

export default rootReducer;
