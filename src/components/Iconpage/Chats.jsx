import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserMessage } from '../../feature/Slice/GetUserMessage';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from "framer-motion";


function Chats({ selectUser, SetSelectUser }) {

  // console.log('selectUser --->/Chats.jsx', selectUser);
  const dispatch = useDispatch();

  const senderId = useSelector((state) => state.auth?.user?.userId);
  // console.log('senderId --->Chats.jsx', senderId);
  const { authUser, unseenMessages, status, error } = useSelector((state) => state.getUserMessage);
  // console.log('status --->/Chats.jsx', status);
  // console.log('unseenMessages --->/Chats.jsx', unseenMessages);
  // console.log('authUser --->/Chats.jsx', authUser);

  useEffect(() => {
    dispatch(getUserMessage());
  }, [dispatch]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    console.log('Search query:', query);
  };

  const getFullName = (user) => `${user.firstname || ''} ${user.lastname || ''}`.trim();


  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= 100; // Scroll left by 100px
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += 100; // Scroll right by 100px
    }
  };

  return (
    <div className='p-2 h-screen w-full'>

      {/*Header*/}
      <div className='p-5 text-2xl font-semibold'>Chats</div>
      <div className="mx-3 mb-6 relative">
        <input
          type="text"
          placeholder="Search messages or users"
          className="w-full pl-10 pr-4 py-2 rounded-md bg-[#E4E9F7] text-gray-700 placeholder-gray-500 focus:outline-none"
          onChange={handleSearch}
        />
        <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/*online user data*/}
      <div className="relative flex items-center justify-center w-full mb-4">
        {/* Left Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute left-2 z-10 bg-white shadow rounded-full p-2"
          onClick={scrollLeft}
        >
          <FaChevronLeft />
        </motion.button>

        {/* Scrollable Avatars */}
        <motion.div
          ref={scrollRef}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex gap-6 overflow-x-auto scrollbar-hide w-[60vw] px-10"
        >
          {authUser.map((chatUser) => (
            <motion.div
              key={chatUser._id}
              className="text-center w-16"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex flex-col items-center w-20">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 text-blue-800 font-semibold">
                  {chatUser.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                  {chatUser.profile_avatar ? (
                    <img
                      src={chatUser.profile_avatar}
                      alt={chatUser.firstname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className=''>
                      {chatUser.firstname?.[0]?.toUpperCase()}
                      {chatUser.lastname?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="font-bold text-sm mt-1 truncate">{chatUser.firstname}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Right Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute right-2 z-10 bg-white shadow rounded-full p-2"
          onClick={scrollRight}
        >
          <FaChevronRight />
        </motion.button>
      </div>

      <div>
        <div>
          <p className="text-lg font-semibold mb-4">Recent</p>
        </div>

        {status === 'loading' ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : (
          <div className='h-[50vh] overflow-auto'>
            {authUser?.map((chatUser) => {
              const unreadCount = unseenMessages?.[chatUser._id] || 0;
              {/*Chat User Data*/ }
              return (

                <div
                  key={chatUser._id}
                  onClick={() => {
                    console.log('Sender ID:', senderId);
                    console.log('Receiver ID:', chatUser._id);
                    SetSelectUser(chatUser);
                  }}
                  className={`flex items-center px-5 py-3 rounded cursor-pointer transition-colors duration-200 
                  ${chatUser.isTyping ? 'bg-[#d9e8ff] hover:bg-[#e3ecff]' : 'hover:bg-[#e3ecff]'}
                  ${selectUser?._id === chatUser._id ? 'bg-gray-200' : ''}`}
                >
                  <div className="relative mr-3">
                    {chatUser.profile_avatar ? (
                      <img
                        src={chatUser.profile_avatar}
                        alt={getFullName(chatUser)}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center text-lg font-semibold">
                        {chatUser.firstname ? chatUser.firstname[0].toUpperCase() : ''}
                      </div>
                    )}
                    {chatUser.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold truncate">{getFullName(chatUser)}</p>
                    <p className={`text-sm ${chatUser.isTyping ? 'text-blue-600 italic' : 'text-gray-500'}`}>
                      {chatUser.message || "No message yet"}
                    </p>
                  </div>

                  <div className="text-right min-w-[50px] ml-2">
                    <p className="text-xs text-gray-400">{chatUser.time || ''}</p>
                    {unreadCount > 0 && (
                      <div className="mt-1.5 bg-red-100 text-red-400 w-7 h-5 rounded-full text-xs font-bold flex items-center justify-center mx-auto">
                        {unreadCount.toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>
                </div>

              );
            })
            }
          </div>
        )

        }
      </div>
    </div>
  );
}

export default Chats;
