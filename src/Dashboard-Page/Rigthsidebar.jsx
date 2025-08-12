import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  connectSocket,
  disconnectSocket,
  markMessagesAsRead,
} from '../feature/Slice/Socket/SocketSlice';

import {
  addOwnMessage,
  setMessages,
  fetchChatHistory,
  setSearchQuery,
} from '../feature/Slice/Chat/ChatHistory';

import {
  incrementUnreadCount,
  resetChatUnreadCount,
} from '../feature/Slice/Socket/unreadCountSlice';

import Header from '../components/Rigthsidebar/Header';
import Chatbody from '../components/Rigthsidebar/Chatbody';
import Inputside from '../components/Rigthsidebar/Inputside';
import RightProfilePanel from '../components/Rigthsidebar/chatprofiledata';

const buildPrivateMessagePayload = ({
  user,
  selectUser,
  message,
  image = [],
  file = [],
  fileName = [],
}) => ({
  senderId: user._id || user.userId,
  receiverId: selectUser._id,
  createdAt: new Date().toISOString(),
  textMessage: message.trim() || null,
  base64Image: image.length ? image : null,
  base64File: file.length ? file : null,
  fileName: file.length ? fileName : null,
  messageType: image.length ? 'image' : file.length ? 'file' : 'text',
  type: image.length ? 'image' : file.length ? 'file' : 'text',
});

const buildGroupMessagePayload = ({
  user,
  selectGroup,
  message,
  image = [],
  file = [],
  fileName = [],
}) => ({
  senderId: user._id || user.userId,
  groupId: selectGroup._id,
  groupName: selectGroup.groupName || selectGroup.name,
  createdAt: new Date().toISOString(),
  textMessage: message.trim() || null,
  base64Image: image.length ? image : null,
  base64File: file.length ? file : null,
  fileName: file.length ? fileName : null,
  messageType: image.length ? 'image' : file.length ? 'file' : 'text',
  type: image.length ? 'image' : file.length ? 'file' : 'text',
});

const Rightsidebar = ({ selectUser, selectGroup, isMobile, onMobileBack }) => {
  const dispatch = useDispatch();
  const { userData: user } = useSelector((state) => state.loginUser);
  const { messages, loadingHistory, currentPage, totalPages, sender, receiver, groupUsers } =
    useSelector((state) => state.chatHistory);
  const { socket, isConnected } = useSelector((state) => state.socket);

  const currentChatId = selectUser?._id || selectGroup?._id;

  const [message, setMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [file, setFile] = useState([]);
  const [image, setImage] = useState([]);
  const [emoji, setEmoji] = useState('');
  const [fileName, setFileName] = useState();
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const scrollEnd = useRef();

  // ✅ Track sent messages to avoid duplicates
  const [sentMessageIds, setSentMessageIds] = useState(new Set());

  useEffect(() => {
    if (!user || (!selectUser && !selectGroup)) return;

    dispatch(setMessages([]));
    // ✅ Clear sent message IDs when switching chats
    setSentMessageIds(new Set());

    const chatData = selectGroup
      ? {
        userId: user._id || user.userId,
        chatWithUserId: null,
        chatType: 'group',
        groupId: selectGroup._id,
      }
      : {
        userId: user._id || user.userId,
        chatWithUserId: selectUser._id,
        chatType: 'private',
        groupId: null,
      };

    socket?.emit('openChatWith', chatData);

    const payload = selectGroup
      ? { groupId: selectGroup._id, page: 1 }
      : { userId1: user._id || user.userId, userId2: selectUser._id, page: 1 };

    dispatch(fetchChatHistory(payload));
  }, [selectUser, selectGroup, user, dispatch, socket]);

  useEffect(() => {
    if (currentChatId && socket) {
      if (selectUser) {
        socket.emit('openChatWith', {
          userId: user._id || user.userId,
          chatWithUserId: selectUser._id,
          chatType: 'private',
        });
        dispatch(
          markMessagesAsRead({
            senderId: user._id || user.userId,
            receiverId: selectUser._id,
          })
        );
      } else if (selectGroup) {
        socket.emit('openChatWith', {
          userId: user._id || user.userId,
          groupId: selectGroup._id,
          chatType: 'group',
        });
      }

      dispatch(resetChatUnreadCount(currentChatId));
    }
  }, [currentChatId, socket, selectUser, selectGroup, user, dispatch]);

  useEffect(() => {
    if (emoji) setMessage((prev) => prev + emoji);
  }, [emoji]);

  useEffect(() => {
    if (!user || !user._id) return;
    console.log('✌️user._id --->', user._id);
    const timeout = setTimeout(() => {
      dispatch(connectSocket(user));
    }, 200);
    return () => {
      clearTimeout(timeout);
      dispatch(disconnectSocket());
    };
  }, [user, dispatch]);

  useEffect(() => {
    if (!socket) return;
    socket.on('typing', ({ senderId, isTyping }) => {
      if (senderId === selectUser?._id) setIsTyping(isTyping);
    });
    return () => socket.off('typing');
  }, [socket, selectUser]);

  useEffect(() => {
    if (socket && selectGroup?._id) {
      socket.emit('joinGroup', { groupId: selectGroup._id });
    }
  }, [socket, selectGroup]);

  useEffect(() => {
    if (!socket) return;
    const currentUserId = String(user._id || user.userId);

    const handleGroupMessage = (data) => {
      console.log("📨 Received group message:", data);

      const senderId = String(data.senderId?._id || data.senderId);
      const messageId = data._id || data.messageId || data.createdAt;

      // ✅ Fixed: જો આ message આપણે જ મોકલ્યો હોય તો ignore કરો
      if (senderId === currentUserId) {
        console.log("🚫 Ignoring own message from socket");
        return;
      }

      // ✅ Check if message already processed
      if (sentMessageIds.has(messageId)) {
        console.log("🚫 Message already processed:", messageId);
        return;
      }

      // ✅ Fixed: માત્ર current group ના messages જ process કરો
      if (selectGroup && data.groupId !== selectGroup._id) {
        console.log("📝 Message for different group, updating unread count");
        dispatch(incrementUnreadCount({ chatId: data.groupId }));
        return;
      }

      const contentArray = Array.isArray(data.content)
        ? data.content
        : [data.content || data.image || data.file || data.textMessage || ''];

      const messageObj = {
        ...data,
        messageId: messageId,
        text: data.text || data.textMessage || contentArray[0] || '',
        content: contentArray,
        type: data.type || 'text',
        image: data.type === 'image' ? contentArray[0] : '',
        file: data.type === 'file' ? contentArray[0] : '',
        createdAt: data.createdAt || new Date().toISOString(),
      };

      console.log("✅ Adding group message to UI:", messageObj);
      dispatch(addOwnMessage(messageObj));

      // ✅ Mark message as processed
      setSentMessageIds(prev => new Set([...prev, messageId]));
    };

    const handlePrivateMessage = (data) => {
      console.log("📨 Received private message:", data);

      const senderId = String(data.senderId?._id || data.senderId);
      const messageId = data._id || data.messageId || data.createdAt;

      // ✅ Fixed: જો આ message આપણે જ મોકલ્યો હોય તો ignore કરો
      if (senderId === currentUserId) {
        console.log("🚫 Ignoring own message from socket");
        return;
      }

      // ✅ Check if message already processed
      if (sentMessageIds.has(messageId)) {
        console.log("🚫 Message already processed:", messageId);
        return;
      }

      const contentArray = Array.isArray(data.content)
        ? data.content
        : [data.content || ''];

      const messageObj = {
        ...data,
        messageId: messageId,
        text: data.text || data.textMessage || contentArray[0] || '',
        content: contentArray,
        type: data.type || 'text',
        image: data.type === 'image' ? contentArray[0] : '',
        file: data.type === 'file' ? contentArray[0] : '',
        createdAt: data.createdAt || new Date().toISOString(),
      };

      // ✅ Fixed: માત્ર current chat ના messages જ show કરો
      if (selectUser && senderId === selectUser._id) {
        console.log("✅ Adding private message to UI:", messageObj);
        dispatch(addOwnMessage(messageObj));

        // ✅ Mark message as processed
        setSentMessageIds(prev => new Set([...prev, messageId]));
      } else {
        console.log("📝 Message for different chat, updating unread count");
        dispatch(incrementUnreadCount({ chatId: senderId }));
      }
    };

    socket.on('groupMessage', handleGroupMessage);
    socket.on('privateMessage', handlePrivateMessage);

    return () => {
      socket.off('groupMessage', handleGroupMessage);
      socket.off('privateMessage', handlePrivateMessage);
    };
  }, [socket, dispatch, user, selectUser, selectGroup, sentMessageIds]);

  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFetchOlderMessages = async () => {
    if (loadingHistory || currentPage >= totalPages) return;
    const payload = selectGroup
      ? { groupId: selectGroup._id, page: currentPage + 1 }
      : {
        userId1: user._id || user.userId,
        userId2: selectUser._id,
        page: currentPage + 1,
      };
    await dispatch(fetchChatHistory(payload));
  };

  useEffect(() => {
    dispatch(setSearchQuery(''));
  }, [selectUser, selectGroup]);

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      socket?.emit('typing', {
        receiverId: selectUser?._id,
        groupId: selectGroup?._id,
        isTyping: true,
      });
      setTimeout(() => {
        setTyping(false);
        socket?.emit('typing', {
          receiverId: selectUser?._id,
          groupId: selectGroup?._id,
          isTyping: false,
        });
      }, 2000);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() && image.length === 0 && file.length === 0) return;

    const payload = selectGroup
      ? buildGroupMessagePayload({ user, selectGroup, message, image, file, fileName })
      : buildPrivateMessagePayload({ user, selectUser, message, image, file, fileName });

    const contentArray = image.length > 0 ? image : file.length > 0 ? file : [message.trim()];
    const tempMessageId = `temp_${Date.now()}_${Math.random()}`;

    // ✅ Fixed: Message object બનાવો UI માટે
    const messageObject = {
      ...payload,
      messageId: tempMessageId,
      text: payload.textMessage,
      images: payload.base64Image,
      files: payload.base64File,
      content: contentArray,
      type: payload.type,
      createdAt: new Date().toISOString(),
      senderId: user._id || user.userId,
      ...(selectGroup ? { groupId: selectGroup._id } : { receiverId: selectUser._id }),
    };

    console.log("📤 Sending message:", payload);
    console.log("🖥️ Adding to UI:", messageObject);

    // ✅ Add to sent messages tracker
    setSentMessageIds(prev => new Set([...prev, tempMessageId]));

    // ✅ First add to UI
    dispatch(addOwnMessage(messageObject));

    // ✅ Then emit to socket
    socket?.emit(selectGroup ? 'groupMessage' : 'privateMessage', payload);

    // ✅ Clear form
    setMessage('');
    setFile([]);
    setImage([]);
    setFileName([]);
  };

  if (!selectUser && !selectGroup) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-blue-700 px-4 text-center">
        <img
          alt="No chat selected"
          className="w-32 h-32 mb-4 opacity-80"
          src="https://via.placeholder.com/128?text=No+Chat"
        />
        <h2 className="text-lg font-semibold mb-2">No chat selected</h2>
        <p className="text-sm text-gray-600">Please select a conversation to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200 overflow-hidden">
      <div className={`flex flex-col h-full ${showProfilePanel ? 'w-[48vw]' : ''}`}>
        <Header
          selectUser={selectUser}
          selectGroup={selectGroup}
          user={user}
          setShowProfilePanel={setShowProfilePanel}
          showProfilePanel={showProfilePanel}
          isTyping={isTyping}
          isMobile={isMobile}
          onMobileBack={onMobileBack}
        />

        <div className="flex-1 overflow-y-auto">
          {loadingHistory && (
            <div className="text-center text-sm text-gray-400 my-2">Loading more messages...</div>
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
          />
        </div>

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
        />
      </div>

      {showProfilePanel && (
        <RightProfilePanel
          selectUser={selectUser}
          selectGroup={selectGroup}
          user={user}
          setShowProfilePanel={setShowProfilePanel}
        />
      )}
    </div>
  );
};

export default Rightsidebar;