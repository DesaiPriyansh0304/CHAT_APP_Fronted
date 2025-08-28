import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Redux Actions(SocketSlice)
import {
  connectSocket,
  disconnectSocket,
  markMessagesAsRead,
} from '../feature/Slice/Socket/SocketSlice';
//chat-history Slice
import {
  addOwnMessage,
  setMessages,
  fetchChatHistory,
  setSearchQuery,
} from '../feature/Slice/Chat/ChatHistory';
//unread message Slice
import {
  incrementUnreadCount,
  resetChatUnreadCount,
} from '../feature/Slice/Socket/unreadCountSlice';
// UI Components(Header + Chatbody + Inputside)
import Header from '../components/Rigthsidebar/Header';
import Chatbody from '../components/Rigthsidebar/Chatbody';
import Inputside from '../components/Rigthsidebar/Inputside';
//RigthSidebar - Contect User data
import RightProfilePanel from '../components/Rigthsidebar/chatprofiledata';

//payload for private messages
const buildPrivateMessagePayload = ({
  user,
  selectUser,
  message,
  image = [],
  file = [],
  fileName = [],
}) => {
  const messageType = image.length > 0 ? 'image' : file.length > 0 ? 'file' : 'text';

  return {
    senderId: user._id || user.userId,
    receiverId: selectUser._id,
    createdAt: new Date().toISOString(),
    textMessage: message?.trim() || null,
    base64Image: image.length > 0 ? image : null,
    base64File: file.length > 0 ? file : null,
    fileName: file.length > 0 ? fileName : null,
    messageType,
    type: messageType,
  };
};

//payload for group messages
const buildGroupMessagePayload = ({
  user,
  selectGroup,
  message,
  image = [],
  file = [],
  fileName = [],
}) => {
  const messageType = image.length > 0 ? 'image' : file.length > 0 ? 'file' : 'text';

  return {
    senderId: user._id || user.userId,
    groupId: selectGroup._id,
    groupName: selectGroup.groupName || selectGroup.name,
    createdAt: new Date().toISOString(),
    textMessage: message?.trim() || null,
    base64Image: image.length > 0 ? image : null,
    base64File: file.length > 0 ? file : null,
    fileName: file.length > 0 ? fileName : null,
    messageType,
    type: messageType,
  };
};

const RightSidebar = ({ selectUser, selectGroup, isMobile, onMobileBack }) => {

  const dispatch = useDispatch();

  const [message, setMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [file, setFile] = useState([]);
  const [image, setImage] = useState([]);
  const [emoji, setEmoji] = useState('');
  const [fileName, setFileName] = useState([]);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [sentMessageIds, setSentMessageIds] = useState(new Set());

  // Login User Slice
  const AuthUserState = useSelector((state) => state.AuthUser || {});
  const { userData: user } = AuthUserState;

  //chatHistory Slice
  const chatHistoryState = useSelector((state) => state.chatHistory || {});
  const { messages, loadingHistory, currentPage, totalPages, sender, receiver, groupUsers } = chatHistoryState;

  //Socket Slice
  const socketState = useSelector((state) => state.socket || {});
  const { socket, isConnected } = socketState;

  // Refs
  const scrollEnd = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Memoized values
  const currentChatId = useMemo(() =>
    selectUser?._id || selectGroup?._id,
    [selectUser, selectGroup]
  );

  const currentUserId = useMemo(() =>
    String(user?._id || user?.userId || ''),
    [user]
  );

  const isGroupChat = useMemo(() =>
    Boolean(selectGroup),
    [selectGroup]
  );

  // Profile panel click handler
  const handleProfileClick = useCallback(() => {
    setShowProfilePanel(prev => !prev);
  }, []);

  //Initialize chat when user or chat selection changes
  useEffect(() => {
    if (!user || (!selectUser && !selectGroup)) return;

    console.log('🔄 Initializing chat for:', selectUser?.name || selectGroup?.name);

    // Clear previous state
    dispatch(setMessages([]));
    setSentMessageIds(new Set());
    setMessage('');
    setShowEmojiPicker(false);

    // openChatWith event
    const chatData = selectGroup
      ? {
        userId: currentUserId,
        chatWithUserId: null,
        chatType: 'group',
        groupId: selectGroup._id,
      }
      : {
        userId: currentUserId,
        chatWithUserId: selectUser._id,
        chatType: 'private',
        groupId: null,
      };

    console.log('📡 Emitting openChatWith:', chatData);
    socket?.emit('openChatWith', chatData);

    //Group joinGroup event  emit 
    if (selectGroup) {
      console.log('👥 Joining group:', selectGroup._id);
      socket?.emit('joinGroup', { groupId: selectGroup._id });
    }

    // Fetch chat history
    const historyPayload = selectGroup
      ? { groupId: selectGroup._id, page: 1 }
      : { userId1: currentUserId, userId2: selectUser._id, page: 1 };

    dispatch(fetchChatHistory(historyPayload));

    // Clear search query
    dispatch(setSearchQuery(''));

  }, [selectUser, selectGroup, user, dispatch, socket, currentUserId]);


  // Mark messages as read and reset unread count
  useEffect(() => {
    if (!currentChatId || !socket || !user) return;

    console.log('📖 Marking messages as read for chat:', currentChatId);

    if (selectUser) {
      socket.emit('openChatWith', {
        userId: currentUserId,
        chatWithUserId: selectUser._id,
        chatType: 'private',
      });

      dispatch(markMessagesAsRead({
        senderId: currentUserId,
        receiverId: selectUser._id,
      }));
    } else if (selectGroup) {
      socket.emit('openChatWith', {
        userId: currentUserId,
        groupId: selectGroup._id,
        chatType: 'group',
      });
    }

    dispatch(resetChatUnreadCount(currentChatId));

  }, [currentChatId, socket, selectUser, selectGroup, currentUserId, dispatch]);


  // Handle emoji selection
  useEffect(() => {
    if (emoji) {
      setMessage((prev) => prev + emoji);
      setEmoji('');
    }
  }, [emoji]);


  // Connect to socket when user is available
  useEffect(() => {
    if (!user?._id) return;

    console.log('🔌 Connecting socket for user:', user._id);

    const timeout = setTimeout(() => {
      dispatch(connectSocket(user));
    }, 200);

    return () => {
      clearTimeout(timeout);
      dispatch(disconnectSocket());
    };
  }, [user, dispatch]);


  // Group Handle typing indicator 
  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({ senderId, isTyping: typing }) => {
      if (selectUser && senderId === selectUser._id) {
        setIsTyping(typing);
      }
    };

    const handleGroupTyping = ({ senderId, isTyping: typing }) => {
      if (selectGroup && senderId !== currentUserId) {
        setIsTyping(typing);
        //Group multiple users typing show extend 
      }
    };

    socket.on('typing', handleTyping);
    socket.on('groupTyping', handleGroupTyping); //  Group typing event add 

    return () => {
      socket.off('typing', handleTyping);
      socket.off('groupTyping', handleGroupTyping);
    };
  }, [socket, selectUser, selectGroup, currentUserId]);




  // Handle incoming messages 
  useEffect(() => {
    if (!socket || !user) return;

    const handleGroupMessage = (data) => {
      console.log('📨 Received group message:', data);
      console.log('📨 Current selectGroup:', selectGroup?._id);
      console.log('📨 Message groupId:', data.groupId);

      const senderId = String(data.senderId?._id || data.senderId);
      const messageGroupId = String(data.groupId?._id || data.groupId);
      const messageId = data._id || data.messageId || `msg_${Date.now()}_${Math.random()}`;

      // Skip own messages
      if (senderId === currentUserId) {
        console.log('🚫 Ignoring own message from socket');
        return;
      }

      // Check for duplicates
      if (sentMessageIds.has(messageId)) {
        console.log('🚫 Message already processed:', messageId);
        return;
      }

      // Group ID matching
      const currentGroupId = String(selectGroup?._id || '');

      if (selectGroup && messageGroupId === currentGroupId) {
        const messageObj = createMessageObject(data, messageId);
        console.log('Adding group message to UI:', messageObj);

        dispatch(addOwnMessage(messageObj));
        setSentMessageIds(prev => new Set([...prev, messageId]));

        if (senderId !== currentUserId) {
          setIsTyping(false);
        }
      } else if (selectGroup && messageGroupId !== currentGroupId) {
        console.log('📝 Message for different group, updating unread count');
        dispatch(incrementUnreadCount({ chatId: messageGroupId }));
      } else {
        console.log('📝 Group message received but no group selected');
        dispatch(incrementUnreadCount({ chatId: messageGroupId }));
      }
    };

    const handlePrivateMessage = (data) => {
      console.log('📨 Received private message:', data);

      const senderId = String(data.senderId?._id || data.senderId);
      const messageId = data._id || data.messageId || `msg_${Date.now()}_${Math.random()}`;

      // Skip own messages
      if (senderId === currentUserId) {
        console.log('🚫 Ignoring own message from socket');
        return;
      }

      // Check for duplicates
      if (sentMessageIds.has(messageId)) {
        console.log('🚫 Message already processed:', messageId);
        return;
      }

      // Handle messages for current chat
      if (selectUser && senderId === selectUser._id) {
        const messageObj = createMessageObject(data, messageId);
        console.log('✅ Adding private message to UI:', messageObj);

        dispatch(addOwnMessage(messageObj));
        setSentMessageIds(prev => new Set([...prev, messageId]));

        // Private message received typing indicator stop
        setIsTyping(false);
      } else {
        console.log('📝 Message for different chat, updating unread count');
        dispatch(incrementUnreadCount({ chatId: senderId }));
      }
    };

    socket.on('groupMessage', handleGroupMessage);
    socket.on('privateMessage', handlePrivateMessage);

    return () => {
      socket.off('groupMessage', handleGroupMessage);
      socket.off('privateMessage', handlePrivateMessage);
    };
  }, [socket, dispatch, currentUserId, selectUser, selectGroup, sentMessageIds]);


  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  // Create standardized message object 
  const createMessageObject = useCallback((data, messageId) => {
    const contentArray = Array.isArray(data.content)
      ? data.content
      : [data.content || data.image || data.file || data.textMessage || ''];

    return {
      ...data,
      messageId,
      text: data.text || data.textMessage || contentArray[0] || '',
      content: contentArray,
      type: data.type || data.messageType || 'text',
      image: data.type === 'image' ? contentArray[0] : data.image || '',
      file: data.type === 'file' ? contentArray[0] : data.file || '',
      createdAt: data.createdAt || new Date().toISOString(),
      isGroupMessage: data.isGroupMessage || Boolean(data.groupId),
      groupId: data.groupId,
    };
  }, []);


  // Handle typing with debounce - Group typing 
  const handleTyping = useCallback((e) => {
    const value = e.target.value;
    setMessage(value);

    if (!socket) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Start typing indicator
    if (!typing) {
      setTyping(true);
      socket.emit('typing', {
        receiverId: selectUser?._id,
        groupId: selectGroup?._id,
        isTyping: true,
      });
    }

    // Stop typing indicator after delay
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      socket.emit('typing', {
        receiverId: selectUser?._id,
        groupId: selectGroup?._id,
        isTyping: false,
      });
    }, 2000);
  }, [socket, typing, selectUser, selectGroup]);


  // Fetch older messages for pagination(History)
  const handleFetchOlderMessages = useCallback(async () => {
    if (loadingHistory || currentPage >= totalPages) return;

    console.log('📜 Fetching older messages, page:', currentPage + 1);

    const payload = selectGroup
      ? { groupId: selectGroup._id, page: currentPage + 1 }
      : { userId1: currentUserId, userId2: selectUser._id, page: currentPage + 1 };

    await dispatch(fetchChatHistory(payload));
  }, [loadingHistory, currentPage, totalPages, selectGroup, currentUserId, selectUser, dispatch]);


  // Send message handler -  Group message 
  const handleSendMessage = useCallback((e) => {
    e.preventDefault();

    // Validate message content
    const hasText = message.trim().length > 0;
    const hasImage = image.length > 0;
    const hasFile = file.length > 0;

    if (!hasText && !hasImage && !hasFile) {
      console.log('🚫 Cannot send empty message');
      return;
    }

    if (!socket) {
      console.log('🚫 Socket not connected');
      return;
    }

    console.log('📤 Sending message...');
    console.log('📤 Chat type:', isGroupChat ? 'GROUP' : 'PRIVATE');
    console.log('📤 Target:', isGroupChat ? selectGroup?.name : selectUser?.name);

    // Build payload based on chat type
    const payload = isGroupChat
      ? buildGroupMessagePayload({ user, selectGroup, message, image, file, fileName })
      : buildPrivateMessagePayload({ user, selectUser, message, image, file, fileName });

    console.log('📤 Message payload:', payload);

    // Create temporary message for UI
    const tempMessageId = `temp_${Date.now()}_${Math.random()}`;
    const contentArray = hasImage ? image : hasFile ? file : [message.trim()];

    const messageObject = {
      ...payload,
      messageId: tempMessageId,
      text: payload.textMessage,
      images: payload.base64Image,
      files: payload.base64File,
      content: contentArray,
      type: payload.type,
      createdAt: new Date().toISOString(),
      senderId: currentUserId,
      isGroupMessage: isGroupChat,
      ...(isGroupChat
        ? { groupId: selectGroup._id }
        : { receiverId: selectUser._id }
      ),
    };

    // Add to sent messages tracker
    setSentMessageIds(prev => new Set([...prev, tempMessageId]));

    // Add to UI immediately
    dispatch(addOwnMessage(messageObject));

    // Send via socket
    const eventName = isGroupChat ? 'groupMessage' : 'privateMessage';
    socket.emit(eventName, payload);

    console.log(`✅ Message sent via ${eventName}:`, payload);

    // Clear form
    setMessage('');
    setFile([]);
    setImage([]);
    setFileName([]);
    setShowEmojiPicker(false);

    // Clear typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setTyping(false);
    socket.emit('typing', {
      receiverId: selectUser?._id,
      groupId: selectGroup?._id,
      isTyping: false,
    });
  }, [
    message,
    image,
    file,
    fileName,
    socket,
    isGroupChat,
    user,
    selectGroup,
    selectUser,
    currentUserId,
    dispatch
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Render empty state when no chat is selected
  if (!selectUser && !selectGroup) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-full text-blue-700 px-4 text-center bg-gray-50 dark:bg-[#36404A]">
          <div className="">
            <div className="w-24 h-24 bg-gray-100 dark:bg-sky-200 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-12 h-12 text-gray-400 dark:text-sky-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-sky-400">No chat selected</h2>
            <p className="text-sm text-gray-600 dark:text-white max-w-xs ">
              Please select a conversation from the sidebar to start chatting.
            </p>
          </div>
        </div>
      </>
    );
  }

  // Main chat interface in body(Header + ChatBody + Inputsidebar)
  return (
    <>
      <div className="flex flex-col h-full bg-white border-l border-gray-200 overflow-hidden">
        <div className={`flex flex-col h-full transition-all duration-300 ${showProfilePanel ? 'w-[60%]' : 'w-full'
          }`}>
          {/* Chat Header */}
          <Header
            selectUser={selectUser}
            selectGroup={selectGroup}
            user={user}
            onProfileClick={handleProfileClick}
            showProfilePanel={showProfilePanel}
            isTyping={isTyping}
            isMobile={isMobile}
            onMobileBack={onMobileBack}
            isConnected={isConnected}
          />

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {loadingHistory && (
              <div className="text-center py-4">
                <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                  <span>Loading more messages...</span>
                </div>
              </div>
            )}

            <Chatbody
              selectUser={selectUser}
              selectGroup={selectGroup}
              user={user}
              scrollEnd={scrollEnd}
              loadingHistory={loadingHistory}
              fetchOlderMessages={handleFetchOlderMessages}
              sender={sender}
              receiver={receiver}
              groupUsers={groupUsers}
              currentPage={currentPage}
              totalPages={totalPages}
              messages={messages}
            />
          </div>

          {/* Message Input Area */}
          <Inputside
            message={message}
            setMessage={setMessage}
            handleTyping={handleTyping}
            handleSendMessage={handleSendMessage}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            file={file}
            setFile={setFile}
            image={image}
            setImage={setImage}
            emoji={emoji}
            setEmoji={setEmoji}
            fileName={fileName}
            setFileName={setFileName}
            selectUser={selectUser}
            selectGroup={selectGroup}
            disabled={!isConnected}
          />
        </div>

        {/* Profile Panel */}
        {showProfilePanel && (
          <div className="w-[40%] border-l border-gray-200 bg-white">
            <RightProfilePanel
              userData={selectUser || selectGroup}
              isGroup={Boolean(selectGroup)}
              onClose={() => setShowProfilePanel(false)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default RightSidebar;