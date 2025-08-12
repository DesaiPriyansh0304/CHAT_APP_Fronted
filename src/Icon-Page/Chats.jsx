import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvitedUsers } from "../feature/Slice/Invited-User/InvitedUsersSlice";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useDebounce } from "use-debounce";
import { selectOnlineUsers } from "../feature/Slice/Socket/OnlineuserSlice";
import { fetchUnreadMessages } from "../feature/Slice/unreadMessageSlice";

function Chats({ selectUser, setSelectUser }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);

  const dispatch = useDispatch();
  const scrollRef = useRef(null);

  // User messages
  const getUserMessage = useSelector((state) => state.getUserMessage || {});
  const { status, error } = getUserMessage;

  // Chat list
  const chatList = useSelector((state) => state.chatList || {});
  const { chats: chatListData = [], loading: chatListLoading } = chatList;

  // Unread messages
  useEffect(() => {
    dispatch(fetchUnreadMessages());
  }, [dispatch]);

  // Invited users
  const invitedUserData = useSelector((state) => state.invitedUsers || {});
  const { invitedUsers = [], invitedBy = [], isLoaded } = invitedUserData;

  const onlineUserIds = useSelector(selectOnlineUsers);
  const onlineUserIdsSet = new Set(onlineUserIds);

  const confirmedInvitedUsers = invitedUsers
    .filter((inv) => inv.invited_is_Confirmed && inv.user)
    .map((inv) => ({ ...inv.user, invited_is_Confirmed: true }));

  const combinedChatUsers = [...confirmedInvitedUsers, ...invitedBy].map(
    (user) => ({
      ...user,
      online: onlineUserIdsSet.has(user._id),
    })
  );

  // Fetch invited users when needed
  useEffect(() => {
    if (!isLoaded || debouncedSearch) {
      dispatch(fetchInvitedUsers(debouncedSearch));
    }
  }, [dispatch, debouncedSearch, isLoaded]);

  // Scroll buttons
  const scrollLeft = () =>
    scrollRef.current && (scrollRef.current.scrollLeft -= 100);
  const scrollRight = () =>
    scrollRef.current && (scrollRef.current.scrollLeft += 100);

  const getFullName = (user) =>
    `${user.firstname || ""} ${user.lastname || ""}`.trim();

  const allUnreadCounts = useSelector(
    (state) => state.unreadCount.chatWiseCount
  );

  // Available users not in chat list
  const getAvailableUsers = () => {
    const chatListUserIds = new Set(chatListData.map((chat) => chat.userId));
    return combinedChatUsers.filter((user) => !chatListUserIds.has(user._id));
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      const date = new Date(timeString);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const messageDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );

      if (messageDate.getTime() === today.getTime()) {
        return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
    } catch {
      return "";
    }
  };

  return (
    <div className="p-2 h-screen w-full">
      {/* Header */}
      <div className="p-5 flex items-center justify-between">
        <div className="text-3xl font-semibold dark:text-[#f8f9fa]">Chats</div>
      </div>

      {/* Search */}
      <div className="mx-3 mb-10 relative">
        <input
          type="text"
          placeholder="Search messages or users"
          className="w-full pl-10 pr-4 py-2.5 rounded-md bg-[#E4E9F7] text-gray-700 placeholder-gray-500 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-600" />
      </div>

      {/* Online avatars */}
      <div className="relative flex items-center justify-center w-full mb-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className="absolute left-2 z-10 bg-white shadow rounded-full p-2"
          onClick={scrollLeft}
        >
          <FaChevronLeft />
        </motion.button>

        <motion.div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide w-[60vw] px-10"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {combinedChatUsers
            .filter((chatUser) => chatUser.online)
            .map((chatUser) => {
              const userUnreadCount = allUnreadCounts?.[chatUser._id] || 0;

              return (
                <motion.div
                  key={chatUser._id}
                  className="text-center w-16"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectUser(chatUser)}
                >
                  <div className="flex flex-col items-center w-20">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 text-blue-800 font-semibold flex items-center justify-center">
                      {chatUser.profile_avatar ? (
                        <img
                          src={chatUser.profile_avatar}
                          alt={chatUser.firstname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>
                          {chatUser.firstname?.[0]?.toUpperCase()}
                          {chatUser.lastname?.[0]?.toUpperCase()}
                        </span>
                      )}
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>

                      {/* {userUnreadCount > 0 &&
                        selectUser?._id !== chatUser._id && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {userUnreadCount > 99 ? "99+" : userUnreadCount}
                          </div>
                        )} */}
                    </div>
                    <p className="font-semibold text-sm dark:text-[#caf0f8] mt-1 truncate">
                      {chatUser.firstname}
                    </p>
                  </div>
                </motion.div>
              );
            })}
        </motion.div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className="absolute right-2 z-10 bg-white shadow rounded-full p-2"
          onClick={scrollRight}
        >
          <FaChevronRight />
        </motion.button>
      </div>

      {/* Recent chats */}
      <div className="w-full h-auto overflow-auto">
        <p className="text-lg font-semibold dark:text-[var(--text-color3)] mb-4">
          Recent
        </p>

        {status === "loading" ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : (
          <div>
            {chatListData.map((chat) => {
              const isOnline = onlineUserIdsSet.has(chat.userId);
              const unreadCount =
                allUnreadCounts?.[chat.userId] || chat.unreadCount || 0;
              const isSelected = selectUser?._id === chat.userId;

              return (
                <div key={`chat-${chat.conversationId}`}>
                  <div
                    onClick={() =>
                      setSelectUser({
                        _id: chat.userId,
                        firstname: chat.name.split(" ")[0] || "",
                        lastname:
                          chat.name.split(" ").slice(1).join(" ") || "",
                        email: chat.email,
                        profile_avatar: chat.avatar,
                        online: isOnline,
                        conversationId: chat.conversationId,
                      })
                    }
                    className={`group flex items-center px-5 py-3 rounded cursor-pointer transition-colors duration-200 
                      hover:bg-[#e3ecff] dark:hover:bg-gray-400
                      ${isSelected ? "bg-gray-200 border-l-4 border-blue-500" : ""}`}
                  >
                    {/* Avatar */}
                    <div className="relative mr-3">
                      {chat.avatar ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img
                            src={chat.avatar}
                            alt={chat.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-400 flex items-center justify-center">
                          <span className="text-white text-lg font-semibold">
                            {chat.name?.[0]?.toUpperCase()}
                          </span>
                        </div>
                      )}
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></span>
                      )}
                    </div>

                    {/* User info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm font-semibold truncate ${isSelected
                            ? "text-black hover:text-black"
                            : "dark:text-white group-hover:text-black"
                            }`}
                        >
                          {chat.name}
                        </p>
                        {/* {isSelected && (
                          <span className="text-blue-500 text-xs font-bold">
                            ● Selected
                          </span>
                        )} */}
                      </div>
                      <p
                        className={`text-sm line-clamp-1 break-words ${isSelected
                          ? "text-gray-500 hover:text-black"
                          : "dark:text-white group-hover:text-black"
                          }`}
                      >
                        {chat.lastMessage
                          ? chat.lastMessage.senderName === "You"
                            ? `You: ${chat.lastMessage.text}`
                            : chat.lastMessage.text
                          : "No message yet"}
                      </p>
                    </div>

                    {/* Time & unread */}
                    <div className="text-right min-w-[50px] ml-2">
                      <p className="text-xs text-gray-400">
                        {formatTime(
                          chat.lastMessage?.time || chat.updatedAt
                        )}
                      </p>
                      {unreadCount > 0 && !isSelected && (
                        <div className="mt-1.5 bg-red-100 text-red-500 w-7 h-5 rounded-full text-xs font-bold flex items-center justify-center mx-auto">
                          {unreadCount.toString().padStart(2, "0")}
                        </div>
                      )}
                    </div>
                  </div>
                  <hr className="my-0.5 mx-2 border-gray-300 dark:border-gray-500" />
                </div>
              );
            })}

            {/* Available users */}
            {getAvailableUsers().map((chatUser) => {
              const unreadCount = allUnreadCounts?.[chatUser._id] || 0;
              const isSelected = selectUser?._id === chatUser._id;

              return (
                <div key={`available-${chatUser._id}`}>
                  <div
                    onClick={() => setSelectUser(chatUser)}
                    className={`group flex items-center px-5 py-3 rounded cursor-pointer transition-colors duration-200 
                      ${chatUser.isTyping
                        ? "bg-[#d9e8ff] hover:bg-[#e3ecff] dark:hover:bg-[#e3ecff]"
                        : "hover:bg-[#e3ecff] dark:hover:bg-gray-400"}
                      ${isSelected ? "bg-gray-200 border-l-4 border-blue-500" : ""}`}
                  >
                    {/* Avatar */}
                    <div className="relative mr-3">
                      {chatUser.profile_avatar ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img
                            src={chatUser.profile_avatar}
                            alt={getFullName(chatUser)}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-400 flex items-center justify-center">
                          <span className="text-white text-lg font-semibold">
                            {chatUser.firstname?.[0]?.toUpperCase()}
                          </span>
                        </div>
                      )}
                      {chatUser.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm font-semibold truncate ${isSelected
                            ? "text-black hover:text-black"
                            : "dark:text-white group-hover:text-black"
                            }`}
                        >
                          {getFullName(chatUser)}
                        </p>
                        {/* {isSelected && (
                          <span className="text-blue-500 text-xs font-bold">
                            ● Selected
                          </span>
                        )} */}
                      </div>
                      <p
                        className={`text-sm line-clamp-1 break-words 
                          ${chatUser.isTyping ? "text-blue-600 italic" : ""} 
                          ${isSelected
                            ? "text-gray-500 hover:text-black"
                            : "dark:text-white group-hover:text-black"
                          }`}
                      >
                        {chatUser.bio || "Start a conversation"}
                      </p>
                    </div>

                    {/* Unread */}
                    <div className="text-right min-w-[50px] ml-2">
                      <p className="text-xs text-gray-400">
                        {chatUser.time || ""}
                      </p>
                      {unreadCount > 0 && !isSelected && (
                        <div className="mt-1.5 bg-red-100 text-red-500 w-7 h-5 rounded-full text-xs font-bold flex items-center justify-center mx-auto">
                          {unreadCount.toString().padStart(2, "0")}
                        </div>
                      )}
                    </div>
                  </div>
                  <hr className="my-0.5 mx-2 border-gray-300 dark:border-gray-500" />
                </div>
              );
            })}

            {/* No chats */}
            {chatListData.length === 0 &&
              getAvailableUsers().length === 0 &&
              !chatListLoading && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No chats or users available
                  </p>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Chats;
