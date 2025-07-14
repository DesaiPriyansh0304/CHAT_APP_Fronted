import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  connectSocket,
  disconnectSocket,
} from '../feature/Slice/SocketSlice';
import {
  addOwnMessage,
  setMessages,
  fetchChatHistory,
} from '../feature/Slice/ChatHistory';
import Header from './Rigthsidebar/Header';
import Chatbody from './Rigthsidebar/Chatbody';
import Inputside from './Rigthsidebar/Inputside';
import RightProfilePanel from './Rigthsidebar/chatprofiledata';

const buildPrivateMessagePayload = ({
  user, selectUser, message, image = [], file = [], fileName = [],
}) => ({
  senderId: user._id || user.userId,
  receiverId: selectUser._id,
  createdAt: new Date().toISOString(),
  textMessage: message.trim() || null,
  base64Image: image.length ? image : null,
  base64File: file.length ? file : null,
  fileName: file.length ? fileName : null,
  messageType: image.length > 0 ? 'image' : file.length > 0 ? 'file' : 'text',
  type: image.length > 0 ? 'image' : file.length > 0 ? 'file' : 'text',
});

const buildGroupMessagePayload = ({
  user, selectGroup, message, image = [], file = [], fileName = [],
}) => ({
  senderId: user._id || user.userId,
  groupId: selectGroup._id,
  createdAt: new Date().toISOString(),
  textMessage: message.trim() || null,
  base64Image: image.length ? image : null,
  base64File: file.length ? file : null,
  fileNames: file.length ? fileName : null,
  messageType: image.length > 0 ? 'image' : file.length > 0 ? 'file' : 'text',
  type: image.length > 0 ? 'image' : file.length > 0 ? 'file' : 'text',
});

const Rightsidebar = ({ selectUser, selectGroup }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const {
    messages, loadingHistory, currentPage, totalPages, sender, receiver,
  } = useSelector((state) => state.chatHistory);
  // console.log("🧠 Redux chatHistory:", {
  //   currentPage,
  //   totalPages,
  // });
  const { socket, isConnected } = useSelector((state) => state.socket);

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

  useEffect(() => {
    if (!selectUser && !selectGroup) return;
    dispatch(setMessages([]));
    const payload = selectGroup
      ? { groupId: selectGroup._id, page: 1 }
      : {
        userId1: user._id || user.userId,
        userId2: selectUser._id,
        page: 1,
      };
    dispatch(fetchChatHistory(payload));
  }, [selectUser, selectGroup, user, dispatch]);

  // ✅ Log sender, receiver, and group ID
  useEffect(() => {
    // if (sender) console.log("🟢 Sender:", sender);
    // if (receiver) console.log("🔵 Receiver:", receiver);
    // if (selectGroup?._id) console.log("👥 Group ID:", selectGroup._id);
  }, [sender, receiver, selectGroup]);

  //page in history data
  const handleFetchOlderMessages = async () => {
    if (loadingHistory || currentPage >= totalPages) return;

    const payload = selectGroup
      ? { groupId: selectGroup._id, page: currentPage + 1 }
      : {
        userId1: user._id || user.userId,
        userId2: selectUser._id,
        page: currentPage + 1,
      };

    await dispatch(fetchChatHistory(payload)); // Ensure it’s awaited
  };


  useEffect(() => {
    if (emoji) setMessage((prev) => prev + emoji);
  }, [emoji]);

  useEffect(() => {
    if (!user || !user.userId) return;
    const timeout = setTimeout(() => {
      const patchedUser = { ...user, _id: user.userId };
      dispatch(connectSocket(patchedUser));
    }, 200);
    return () => {
      clearTimeout(timeout);
      dispatch(disconnectSocket());
    };
  }, [user, dispatch]);

  useEffect(() => {
    if (!socket) return;
    socket.on('typing', ({ senderId, isTyping }) => {
      if (senderId === selectUser?._id) {
        setIsTyping(isTyping);
      }
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
      const senderId =
        typeof data.senderId === 'object' ? String(data.senderId._id) : String(data.senderId);
      if (senderId === currentUserId) return;
      const contentArray = Array.isArray(data.content) ? data.content : [data.content];
      const firstContent = contentArray[0] || '';
      dispatch(addOwnMessage({
        ...data,
        text: data.text || firstContent || '',
        content: contentArray,
        type: data.type || 'text',
        image: data.type === 'image' ? firstContent : '',
        file: data.type === 'file' ? firstContent : '',
      }));
    };

    const handlePrivateMessage = (data) => {
      const senderId =
        typeof data.senderId === 'object' ? String(data.senderId._id) : String(data.senderId);
      if (senderId === currentUserId) return;
      const contentArray = Array.isArray(data.content) ? data.content : [data.content];
      const firstContent = contentArray[0] || '';
      dispatch(addOwnMessage({
        ...data,
        text: data.text || firstContent || '',
        content: contentArray,
        type: data.type || 'text',
        image: data.type === 'image' ? firstContent : '',
        file: data.type === 'file' ? firstContent : '',
      }));
    };

    socket.on('groupMessage', handleGroupMessage);
    socket.on('privateMessage', handlePrivateMessage);

    return () => {
      socket.off('groupMessage', handleGroupMessage);
      socket.off('privateMessage', handlePrivateMessage);
    };
  }, [socket, dispatch, user]);

  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      socket?.emit('typing', {
        receiverId: selectUser?._id,
        isTyping: true,
      });
      setTimeout(() => {
        setTyping(false);
        socket?.emit('typing', {
          receiverId: selectUser?._id,
          isTyping: false,
        });
      }, 2000);
    }
  };

  // const handleSendMessage = (e) => {
  //   e.preventDefault();
  //   const isEmptyMessage = !message.trim() && image.length === 0 && file.length === 0;
  //   if (isEmptyMessage || (!selectUser && !selectGroup)) return;

  //   const payload = selectGroup
  //     ? buildGroupMessagePayload({ user, selectGroup, message, image, file, fileName })
  //     : buildPrivateMessagePayload({ user, selectUser, message, image, file, fileName });

  //   const contentArray =
  //     image.length > 0 ? image : file.length > 0 ? file : [message.trim()];

  //   const messageObject = {
  //     ...payload,
  //     text: payload.textMessage,
  //     images: payload.base64Image,
  //     files: payload.base64File,
  //     content: contentArray,
  //     type: payload.type,
  //   };

  //   if (!selectGroup) {
  //     dispatch(addOwnMessage(messageObject));
  //   }

  //   socket?.emit(selectGroup ? 'groupMessage' : 'privateMessage', payload);

  //   setMessage('');
  //   setFile([]);
  //   setImage([]);
  //   setFileName([]);
  // };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const isEmptyMessage = !message.trim() && image.length === 0 && file.length === 0;
    if (isEmptyMessage || (!selectUser && !selectGroup)) return;

    const payload = selectGroup
      ? buildGroupMessagePayload({ user, selectGroup, message, image, file, fileName })
      : buildPrivateMessagePayload({ user, selectUser, message, image, file, fileName });

    const contentArray =
      image.length > 0 ? image : file.length > 0 ? file : [message.trim()];

    const messageObject = {
      ...payload,
      text: payload.textMessage,
      images: payload.base64Image,
      files: payload.base64File,
      content: contentArray,
      type: payload.type,
    };

    // Show message immediately for sender
    dispatch(addOwnMessage(messageObject));

    socket?.emit(selectGroup ? 'groupMessage' : 'privateMessage', payload);

    setMessage('');
    setFile([]);
    setImage([]);
    setFileName([]);
  };


  const { groupUsers } = useSelector((state) => state.chatHistory);

  useEffect(() => {
    console.log("🧑‍🤝‍🧑 Group Members:");
    groupUsers.forEach(({ user, role }) => {
      // console.log('✌️user --->', user);
      if (user) {
        console.log(`${user.firstname} ${user.lastname} - Role: ${role}`);
      }
    });
  }, [groupUsers]);


  if (!selectUser && !selectGroup) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-blue-700 px-4 text-center">
        <img
          alt="No chat selected"
          className="w-32 h-32 mb-4 opacity-80"
          src="https://via.placeholder.com/128?text=No+Chat"
        />
        <h2 className="text-lg font-semibold mb-2">No chat selected</h2>
        <p className="text-sm text-gray-600">
          Please select a conversation to start chatting.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200 overflow-hidden">
      <div className={`flex flex-col h-full ${showProfilePanel ? 'w-[48vw]' : ''}`}>
        <div className="flex-shrink-0">
          <Header
            selectUser={selectUser}
            selectGroup={selectGroup}
            isTyping={isTyping}
            user={user}
            onProfileClick={() => setShowProfilePanel(true)}
          />
          {!isConnected && (
            <div className="text-red-600 text-sm text-center p-2 bg-yellow-100">
              🔌 Reconnecting to socket...
            </div>
          )}
        </div>


        <div className="flex-1 overflow-y-auto">
          {loadingHistory && (
            <div className="text-center text-sm text-gray-400 my-2">Loading more messages...</div>
          )}
          <Chatbody
            selectUser={selectUser}
            selectGroup={selectGroup}
            messages={messages}
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

        <div className="flex-shrink-0 bottom-fixed">
          <Inputside
            message={message}
            setMessage={setMessage}
            handleTyping={handleTyping}
            handleSendMessage={handleSendMessage}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            selectUser={selectUser}
            selectGroup={selectGroup}
            setFile={setFile}
            setImage={setImage}
            setEmoji={setEmoji}
            setFileName={setFileName}
            file={file}
            image={image}
            fileName={fileName}
          />
        </div>
      </div>

      {showProfilePanel && (
        <RightProfilePanel
          userData={selectUser || selectGroup}
          isGroup={!!selectGroup}
          onClose={() => setShowProfilePanel(false)}
        />
      )}
    </div>
  );
};

export default Rightsidebar;
