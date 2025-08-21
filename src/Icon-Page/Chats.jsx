import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { RiUserSearchLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { useDebounce } from "use-debounce";
import { fetchInvitedUsers } from "../feature/Slice/Invited-User/InvitedUsersSlice";
import { selectOnlineUsers } from "../feature/Slice/Socket/OnlineuserSlice";
import { fetchUnreadMessages } from "../feature/Slice/unreadMessageSlice";


function Chats({ selectUser, setSelectUser }) {

  const [search, setSearch] = useState("");                  //searchbar
  const [debouncedSearch] = useDebounce(search, 400);

  const dispatch = useDispatch();
  const scrollRef = useRef(null);



  // User messages
  const getUserMessage = useSelector((state) => state.getUserMessage || {});
  const { status, error } = getUserMessage;
  // console.log('getUserMessage --->chat.jsx', getUserMessage);

  // Chat list slice (show in user)
  const chatList = useSelector((state) => state.chatList || {});
  const { chats: chatListData = [], loading: chatListLoading } = chatList;
  // console.log('chatList --->chat.jsx', chatList);

  // Invited users Slice (full response)
  const invitedUserData = useSelector((state) => state.invitedUsers || {});
  const { invitedUsers = [], invitedBy = [], isLoaded } = invitedUserData;
  // console.log('invitedUserData --->chat.jsx', invitedUserData);

  {/*api call*/ }
  // Fetch users api call invited user + invited by
  useEffect(() => {
    if (!isLoaded || debouncedSearch) {
      dispatch(fetchInvitedUsers(debouncedSearch));
    }
  }, [dispatch, debouncedSearch, isLoaded]);

  // Unread messages api call
  useEffect(() => {
    dispatch(fetchUnreadMessages());
  }, [dispatch]);



  const onlineUserIds = useSelector(selectOnlineUsers);          // all online user id 
  // console.log('onlineUserIds --->chat.jsx', onlineUserIds);
  const onlineUserIdsSet = new Set(onlineUserIds);

  //invited User Data -- filter user(only invite user)
  const confirmedInvitedUsers = invitedUsers
    .filter((inv) => inv.invited_is_Confirmed && inv.user)
    .map((inv) => ({ ...inv.user, invited_is_Confirmed: true }));
  // console.log('confirmedInvitedUsers --->/chat.jsx', confirmedInvitedUsers);

  //conbmin user invited user and invited by
  const combinedChatUsers = [...confirmedInvitedUsers, ...invitedBy].map(
    (user) => ({
      ...user,
      online: onlineUserIdsSet.has(user._id),
    })
  );
  // console.log('combinedChatUsers --->chat.jsx', combinedChatUsers);


  // Available users not in chat list
  const getAvailableUsers = () => {
    const chatListUserIds = new Set(chatListData.map((chat) => chat.userId));
    return combinedChatUsers.filter((user) => !chatListUserIds.has(user._id));
  };

  // Filter functions for search in last message in set user data
  const filterChatsBySearch = (chats, searchTerm) => {
    if (!searchTerm.trim()) return chats;

    return chats.filter((chat) => {
      const name = chat.name?.toLowerCase() || "";
      const lastMessage = chat.lastMessage?.text?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();

      return name.includes(search) || lastMessage.includes(search);
    });
  };


  //user detail info in serch user
  const filterAvailableUsersBySearch = (users, searchTerm) => {
    if (!searchTerm.trim()) return users;

    return users.filter((user) => {
      const fullName = getFullName(user).toLowerCase();
      const email = user.email?.toLowerCase() || "";
      const bio = user.bio?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();

      return fullName.includes(search) || email.includes(search) || bio.includes(search);
    });
  };


  //Apply search filters
  const filteredChatListData = filterChatsBySearch(chatListData, search);
  // console.log('filteredChatListData --->chat.jsx', filteredChatListData);
  const filteredAvailableUsers = filterAvailableUsersBySearch(getAvailableUsers(), search);
  // console.log('filteredAvailableUsers --->chat.jsx', filteredAvailableUsers);

  //format Time to message 
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

  // Scroll buttons in online user
  const scrollLeft = () =>
    scrollRef.current && (scrollRef.current.scrollLeft -= 100);
  const scrollRight = () =>
    scrollRef.current && (scrollRef.current.scrollLeft += 100);

  //user full name
  const getFullName = (user) => `${user.firstname || ""} ${user.lastname || ""}`.trim();

  //sender user id + message counte number(id+2)
  const allUnreadCounts = useSelector((state) => state.unreadCount.chatWiseCount);
  // console.log('allUnreadCounts --->/chat.jsx', allUnreadCounts);


  return (
    <>
      <div className="p-2 h-screen md:w-full">
        {/* Header */}
        <div className="p-5 flex items-center justify-between">
          <div className="text-2xl font-semibold dark:text-[#f8f9fa]">Chats</div>
        </div>

        {/* Search-bar */}
        <div className="mx-3 mb-10 relative">
          <input
            type="text"
            placeholder="Search Users..."
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-blue-100 text-black placeholder-gray-500 border-2 border-blue-500 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* Left side search icon */}
          <RiUserSearchLine className="absolute text-lg top-1/2 left-3 transform -translate-y-1/2 text-gray-700" />

          {/* clear icon - only when search has text */}
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 hover:text-red-600 cursor-pointer"
            >
              <RxCross2 />
            </button>
          )}
        </div>

        {/* Online avatars - Show when no search OR when searching */}
        {(() => {
          const onlineUsers = combinedChatUsers.filter((chatUser) => chatUser.online);

          // If searching, filter online users by search term
          const displayOnlineUsers = search.trim()
            ? onlineUsers.filter((user) => {
              const fullName = getFullName(user).toLowerCase();
              const email = user.email?.toLowerCase() || "";
              const searchLower = search.toLowerCase();
              return fullName.includes(searchLower) || email.includes(searchLower);
            })
            : onlineUsers;

          return displayOnlineUsers.length > 0 ? (
            <div className="relative flex items-center justify-center w-full mb-4">
              {/* Left Arrow Button - Only show if there are scrollable users */}
              {displayOnlineUsers.length > 4 && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "#3b82f6",
                    color: "white"
                  }}
                  className="absolute left-2 z-10 bg-white hover:bg-blue-500 hover:text-white shadow-lg rounded-full p-3 border border-gray-200 transition-all duration-200 ease-in-out"
                  onClick={scrollLeft}
                  title="Previous users"
                >
                  <FaChevronLeft className="w-4 h-4" />
                </motion.button>
              )}

              <motion.div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide w-[60vw] px-10"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                {displayOnlineUsers.map((chatUser) => {
                  return (
                    <motion.div
                      key={chatUser._id}
                      className="text-center w-16 cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectUser(chatUser)}
                    >
                      <div className="flex flex-col items-center w-20 relative">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 text-blue-800 font-semibold flex items-center justify-center hover:ring-2 hover:ring-blue-300 transition-all duration-200">
                          {chatUser.profile_avatar ? (
                            <img
                              src={chatUser.profile_avatar}
                              alt={chatUser.firstname}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-lg">
                              {chatUser.firstname?.[0]?.toUpperCase()}
                              {chatUser.lastname?.[0]?.toUpperCase()}
                            </span>
                          )}
                        </div>
                        {/* Green dot positioned at bottom-right of avatar */}
                        <div className="absolute top-8 right-3 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-lg z-20"></div>
                        <p className="font-semibold text-sm dark:text-[#caf0f8] mt-1 truncate">
                          {chatUser.firstname}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Right Arrow Button - Only show if there are scrollable users */}
              {displayOnlineUsers.length > 4 && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "#3b82f6",
                    color: "white"
                  }}
                  className="absolute right-2 z-10 bg-white hover:bg-blue-500 hover:text-white shadow-lg rounded-full p-3 border border-gray-200 transition-all duration-200 ease-in-out"
                  onClick={scrollRight}
                  title="Next users"
                >
                  <FaChevronRight className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          ) : null;
        })()}

        {/* Recent chats */}
        <div className="w-full h-auto overflow-auto mt-3.5">

          <div>
            <p className="text-xl font-semibold  mb-6">
              {search.trim() ? `Search Results` : `Recent`}
            </p>
          </div>

          {/* User chats data */}
          {status === "loading" ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">Error: {error}</p>
          ) : (
            <div>
              {/* Show filtered recent chats */}
              {filteredChatListData.map((chat) => {
                //online user
                const isOnline = onlineUserIdsSet.has(chat.userId);
                //unread count
                const unreadCount = allUnreadCounts?.[chat.userId] || chat.unreadCount || 0;
                //selected
                const isSelected = selectUser?._id === chat.userId;


                return (
                  <div key={`chat-${chat.conversationId}`}>
                    <div
                      onClick={() =>
                        setSelectUser({
                          _id: chat.userId,
                          firstname: chat.name.split(" ")[0] || "",
                          lastname: chat.name.split(" ").slice(1).join(" ") || "",
                          email: chat.email,
                          profile_avatar: chat.avatar,
                          online: isOnline,
                          conversationId: chat.conversationId,
                        })
                      }
                      className={`group flex items-center px-5 py-3 rounded cursor-pointer transition-colors duration-200                       hover:bg-[#e3ecff] dark:hover:bg-gray-400
                                  ${isSelected ? "bg-gray-200 border-l-4 border-blue-500" : ""}
                      `}
                    >
                      {/* Avatar img */}
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
                        {/*user name*/}
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-semibold truncate
                                        ${isSelected ? "text-black hover:text-black" : "dark:text-white group-hover:text-black"}
                                       `}
                          >
                            {chat.name}
                          </p>
                        </div>
                        {/*sender last message*/}
                        <div>
                          <p
                            className={`text-sm line-clamp-1 break-words
                                        ${isSelected ? "text-gray-500 hover:text-black" : "dark:text-white group-hover:text-black"}
                                      `}
                          >
                            {chat.lastMessage
                              ? chat.lastMessage.senderName === "You"
                                ? `You: ${chat.lastMessage.text}`
                                : chat.lastMessage.text
                              : "No message yet"}
                          </p>
                        </div>
                      </div>

                      {/* Time & unread */}
                      <div className="text-right min-w-[50px] ml-2">
                        <p className="text-xs text-gray-400">
                          {formatTime(
                            chat.lastMessage?.time || chat.updatedAt
                          )}
                        </p>
                        {/* unread count show */}
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

              {/* Show filtered available users */}
              {filteredAvailableUsers.map((chatUser) => {

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

                      {/* user info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-semibold truncate
                                        ${isSelected ? "text-black hover:text-black" : "dark:text-white group-hover:text-black"}
                                     `}
                          >
                            {getFullName(chatUser)}
                          </p>
                        </div>
                        <p
                          className={`text-sm line-clamp-1 break-words 
                                      ${chatUser.isTyping ? "text-blue-600 italic" : ""} 
                                      ${isSelected ? "text-gray-500 hover:text-black" : "dark:text-white group-hover:text-black"}
                                    `}
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

              {/* No results found  */}
              {search.trim() &&
                filteredChatListData.length === 0 &&
                filteredAvailableUsers.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No results found for "{search}"
                    </p>
                  </div>
                )}

              {/* No chats when not searching */}
              {!search.trim() &&
                chatListData.length === 0 &&
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
    </>
  );
}

export default Chats;