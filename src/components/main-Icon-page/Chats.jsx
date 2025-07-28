import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvitedUsers } from '../../feature/Slice/Invited-User/InvitedUsersSlice';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useDebounce } from 'use-debounce';
import { selectOnlineUsers } from '../../feature/Slice/Socket/OnlineuserSlice';
// import { selectChatUnreadCount } from '../../feature/Slice/unreadCountSlice';

function Chats({ selectUser, SetSelectUser }) {

  const [search, setSearch] = useState('');            //serch State
  const [debouncedSearch] = useDebounce(search, 400);  //useDebounce


  const dispatch = useDispatch();
  const scrollRef = useRef(null);

  //getUser Message data
  const { status, error } = useSelector((state) => state.getUserMessage);

  {/*Invited User Data Slice*/ }
  const {
    invitedUsers = [],
    invitedBy = [],
    isLoaded,
  } = useSelector((state) => state.invitedUsers);

  const onlineUserIds = useSelector(selectOnlineUsers); // get online user ID
  // console.log('onlineUserIds --->/Chats-page', onlineUserIds);

  // Convert onlineUserIds to Set for fast lookup
  const onlineUserIdsSet = new Set(onlineUserIds);

  // Prepare confirmed invited users
  const confirmedInvitedUsers = invitedUsers
    .filter((inv) => inv.invited_is_Confirmed && inv.user)
    .map((inv) => ({ ...inv.user, invited_is_Confirmed: true }));

  //  Combine users and assign `.online` flag
  const combinedChatUsers = [...confirmedInvitedUsers, ...invitedBy].map((user) => ({
    ...user,
    online: onlineUserIdsSet.has(user._id), // set online true/false
  }));

  {/*Invited User Data Slice Store data*/ }
  useEffect(() => {
    if (!isLoaded || debouncedSearch) {
      dispatch(fetchInvitedUsers(debouncedSearch));
    }
  }, [dispatch, debouncedSearch, isLoaded]);

  {/*Scoller in only online user*/ }
  const scrollLeft = () => scrollRef.current && (scrollRef.current.scrollLeft -= 100);
  const scrollRight = () => scrollRef.current && (scrollRef.current.scrollLeft += 100);
  const getFullName = (user) => `${user.firstname || ''} ${user.lastname || ''}`.trim();   //User Full Name
  const allUnreadCounts = useSelector((state) => state.unreadCount.chatWiseCount);
  return (
    <>
      <div className="p-2 h-screen w-full">
        {/* Header */}
        <div className="p-5 text-3xl font-semibold dark:text-[#f8f9fa]">Chats</div>

        {/* Search Box */}
        <div className="mx-3 mb-6 relative">
          <div>
            <input
              type="text"
              placeholder="Search messages or users"
              className="w-full pl-10 pr-4 py-2.5 rounded-md bg-[#E4E9F7] text-gray-700 placeholder-gray-500 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-600" />
          </div>
        </div>

        {/* Online Avatars */}
        <div className="relative flex items-center justify-center w-full mb-4">

          {/*Left side icon*/}
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            className="absolute left-2 z-10 bg-white shadow rounded-full p-2"
            onClick={scrollLeft}
          >
            <FaChevronLeft />
          </motion.button>

          {/*only online use show*/}
          <motion.div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide w-[60vw] px-10"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {combinedChatUsers
              .filter((chatUser) => chatUser.online)
              .map((chatUser) => (
                <motion.div
                  key={chatUser._id}
                  className="text-center w-16"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => SetSelectUser(chatUser)}
                >
                  {/*Profile image*/}
                  <div className="flex flex-col items-center w-20">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 text-blue-800 font-semibold flex items-center justify-center">
                      {chatUser.online && (
                        <span className="absolute bottom-0 right-0 max-w-3 max-h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
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
                    </div>
                    {/*user name*/}
                    <div>
                      <p className="font-semibold text-sm dark:text-[#caf0f8] mt-1 truncate">
                        {chatUser.firstname}
                      </p>
                    </div>

                  </div>

                </motion.div>
              ))}
          </motion.div>

          {/*right side icon*/}
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            className="absolute right-2 z-10 bg-white shadow rounded-full p-2"
            onClick={scrollRight}
          >
            <FaChevronRight />
          </motion.button>
        </div>

        {/* Recent Chat Users List */}
        <div>

          {/*Recent*/}
          <div>
            <p className="text-lg font-semibold dark:text-[var(--text-color3)] mb-4">Recent</p>
          </div>

          <div className='w-full h-[40vh]'>
            {status === 'loading' ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-center text-red-500">Error: {error}</p>
            ) : (
              <div className=" overflow-auto">
                {combinedChatUsers.map((chatUser) => {
                  //count message
                  const unreadCount = allUnreadCounts?.[chatUser._id] || 0;
                  return (
                    <div key={chatUser._id}>
                      <div
                        onClick={() => SetSelectUser(chatUser)}
                        className={` group flex items-center px-5 py-3 rounded cursor-pointer transition-colors duration-200 
                         ${chatUser.isTyping
                            ? 'bg-[#d9e8ff] hover:bg-[#e3ecff]  dark:hover:bg-[#e3ecff]'
                            : 'hover:bg-[#e3ecff] dark:hover:bg-gray-400'
                          }
                           ${selectUser?._id === chatUser._id ? 'bg-gray-200' : ''}`}
                      >
                        {/* Avatar */}
                        <div className="relative mr-3">
                          {chatUser.profile_avatar ? (
                            //img
                            <div className='w-10 h-10 rounded-full overflow-hidden'>
                              <img
                                src={chatUser.profile_avatar}
                                alt={getFullName(chatUser)}
                                className=" w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-11\0 rounded-full overflow-hidden bg-gray-400 flex items-center justify-center">
                              <span className="text-white text-lg font-semibold">
                                {chatUser.firstname?.[0]?.toUpperCase()}
                              </span>
                            </div>
                          )}
                          {chatUser.online && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></span>
                          )}
                        </div>

                        {/* User data */}
                        <div className="flex-1">
                          <p
                            className={`text-sm font-semibold truncate ${selectUser?._id === chatUser._id
                              ? 'text-black hover:text-black'
                              : 'dark:text-white group-hover:text-black'
                              }`}
                          >
                            {getFullName(chatUser)}
                          </p>
                          {/*User bio*/}
                          <p
                            className={`text-sm   line-clamp-1 break-words 
                               ${chatUser.isTyping ? 'text-blue-600 italic' : ''} 
                               ${selectUser?._id === chatUser._id
                                ? 'text-gray-500 '
                                : 'dark:text-[#adb5bd]  group-hover:text-white'
                              }
                              `}
                          >
                            {chatUser.bio || 'No message yet'}
                          </p>

                        </div>

                        {/* Unread */}
                        <div className="text-right min-w-[50px] ml-2">
                          <p className="text-xs text-gray-400">{chatUser.time || ''}</p>
                          {unreadCount > 0 && (
                            <div className="mt-1.5 bg-red-100 text-red-500 w-7 h-5 rounded-full text-xs font-bold flex items-center justify-center mx-auto">
                              {unreadCount.toString().padStart(2, '0')}
                            </div>
                          )}
                        </div>

                      </div>
                      <hr className="my-0.5 mx-2 border-gray-300 dark:border-gray-500" />
                    </div>
                  );
                })}

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Chats;
