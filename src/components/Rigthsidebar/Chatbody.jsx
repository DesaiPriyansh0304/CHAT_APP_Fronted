import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectFilteredMessages } from '../../feature/Slice/Chat/ChatHistory';
import { SenderMessage, ReceiverMessage } from '../Rigthsidebar/Messageui';

const Chatbody = ({
  user,
  scrollEnd,
  loadingHistory,
  fetchOlderMessages,
  sender,
  receiver,
  groupUsers,
  currentPage,
  totalPages,
  selectUser,
  selectGroup,
}) => {
  const containerRef = useRef(null);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [isImagePreview, setIsImagePreview] = useState(true);

  const allMessages = useSelector(selectFilteredMessages);
  const currentUserId = String(user?._id || user?.userId || '');

  // ✅ Fixed message filtering logic
  const messages = allMessages.filter((msg) => {
    const senderId = String(msg.senderId?._id || msg.senderId || '');
    const receiverId = String(msg.receiverId?._id || msg.receiverId || '');

    if (selectUser) {
      // Private chat filtering
      const selectedUserId = String(selectUser._id || '');
      return (
        (senderId === currentUserId && receiverId === selectedUserId) ||
        (senderId === selectedUserId && receiverId === currentUserId)
      );
    } else if (selectGroup) {
      // ✅ Group chat filtering - API માં groupId નથી, તો isGroupMessage flag use કરીએ
      // જો message group માં send કરેલો છે તો receiverId null હશે અથવા empty હશે
      const messageGroupId = String(msg.groupId?._id || msg.groupId || '');
      const selectedGroupId = String(selectGroup._id || '');

      // Check કરો કે આ message group માં છે કે નહીં
      const isGroupMessage = msg.isGroupMessage || (!msg.receiverId || receiverId === '');

      // જો groupId available છે તો match કરો, નહીં તો isGroupMessage flag આધારે
      if (messageGroupId && selectedGroupId) {
        return messageGroupId === selectedGroupId;
      }

      // Fallback: જો groupId નથી, તો assume કરો કે all messages group નાં છે
      // કારણ કે આપણે group chat fetch કર્યો છે
      return isGroupMessage;
    }
    return false;
  });

  // ✅ Debug logs સુધારેલા
  if (process.env.NODE_ENV === 'development') {
    console.log('🔥 Debug Info:');
    console.log('Chat Type:', selectGroup ? 'GROUP' : 'PRIVATE');
    console.log('selectGroup:', selectGroup);
    console.log('selectedGroupId:', selectGroup?._id);
    console.log('allMessages count:', allMessages.length);
    console.log('filtered messages count:', messages.length);
    console.log('groupUsers count:', groupUsers?.length || 0);

    if (selectGroup && allMessages.length > 0) {
      console.log('Sample messages structure:', allMessages.slice(0, 3).map(msg => ({
        messageId: msg.messageId,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        groupId: msg.groupId,
        isGroupMessage: msg.isGroupMessage,
        text: msg.text?.substring(0, 30),
      })));
    }
  }

  // ✅ Message validation સુધારેલું
  const messagesWithValidation = messages
    .map((msg, idx) => {
      const senderId = String(msg.senderId?._id || msg.senderId || '');
      const isSender = senderId === currentUserId;

      const messageText = msg.text || msg.textMessage || '';
      const messageType = msg.type || 'text';

      let contentArray = [];
      if (Array.isArray(msg.content)) {
        contentArray = msg.content;
      } else if (msg.content) {
        contentArray = [msg.content];
      } else if (msg.image) {
        contentArray = [msg.image];
      } else if (msg.file) {
        contentArray = [msg.file];
      }

      const messageContent = contentArray[0] || '';
      const fileName = Array.isArray(msg.fileName)
        ? msg.fileName[0]
        : msg.fileName || 'Download File';

      const isImage =
        messageType === 'image' &&
        typeof messageContent === 'string' &&
        messageContent.length > 0 &&
        (messageContent.startsWith('http') || messageContent.startsWith('data:image/'));

      const isFile =
        messageType === 'file' &&
        typeof messageContent === 'string' &&
        messageContent.length > 0 &&
        (messageContent.startsWith('http') || messageContent.startsWith('data:'));

      const hasText = typeof messageText === 'string' && messageText.trim() !== '';
      const hasValidContent = contentArray.some(
        (item) => typeof item === 'string' && item.trim() !== ''
      );

      // Empty message validation
      if (!hasText && !hasValidContent && !isImage && !isFile) {
        console.warn(`⚠️ Empty message filtered out:`, {
          messageId: msg.messageId,
          senderId: msg.senderId,
          text: msg.text,
          content: msg.content,
          type: msg.type
        });
        return null;
      }

      return {
        ...msg,
        idx,
        isSender,
        messageText,
        messageType,
        messageContent,
        fileName,
        isImage,
        isFile,
        hasText,
        hasValidContent,
        contentArray,
      };
    })
    .filter(Boolean);

  // Scroll to top logic for pagination
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = async () => {
      if (container.scrollTop < 100 && !loadingHistory && currentPage < totalPages) {
        const previousScrollHeight = container.scrollHeight;
        await fetchOlderMessages();
        requestAnimationFrame(() => {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - previousScrollHeight;
        });
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loadingHistory, fetchOlderMessages, currentPage, totalPages]);

  let lastSenderId = null;
  let lastDate = null;

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-y-auto px-4 py-2 space-y-2 bg-gray-50 dark:bg-[#222831] transition-colors duration-300"
    >
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 p-2 bg-yellow-100 rounded">
          Debug: Showing {messagesWithValidation.length} messages for {selectGroup ? `Group: ${selectGroup.name || selectGroup._id}` : 'Private'} chat
          {selectGroup && (
            <div className="mt-1">
              Group ID: {selectGroup._id} | Group Users: {groupUsers?.length || 0}
            </div>
          )}
        </div>
      )}

      {loadingHistory && (
        <div className="flex items-center justify-center py-4 text-gray-500">
          <p>Loading messages...</p>
        </div>
      )}

      {messagesWithValidation.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <p>No messages found</p>
            {selectGroup && (
              <p className="text-xs mt-2">
                Start a conversation in {selectGroup.name || 'this group'}
              </p>
            )}
          </div>
        </div>
      ) : (
        messagesWithValidation.map((msg) => {
          const senderId = String(msg.senderId);
          const messageDate = new Date(msg.createdAt).toDateString();
          const showGroupHeader = senderId !== lastSenderId || messageDate !== lastDate;

          if (showGroupHeader) {
            lastSenderId = senderId;
            lastDate = messageDate;
          }

          return (
            <div key={msg.messageId || msg._id || msg.idx} className="flex flex-col">
              {msg.isSender ? (
                <SenderMessage
                  msg={msg}
                  messageDate={messageDate}
                  messageText={msg.messageText}
                  messageContent={msg.messageContent}
                  hasText={msg.hasText}
                  isImage={msg.isImage}
                  isImageBase64={msg.messageContent.startsWith('data:')}
                  isFile={msg.isFile}
                  isFileBase64={msg.messageContent.startsWith('data:')}
                  fileName={msg.fileName}
                  setPreviewMedia={setPreviewMedia}
                  setIsImagePreview={setIsImagePreview}
                  sender={sender}
                  groupUsers={groupUsers}
                />
              ) : (
                <ReceiverMessage
                  msg={msg}
                  messageDate={messageDate}
                  messageText={msg.messageText}
                  messageContent={msg.messageContent}
                  hasText={msg.hasText}
                  isImage={msg.isImage}
                  isImageBase64={msg.messageContent.startsWith('data:')}
                  isFile={msg.isFile}
                  isFileBase64={msg.messageContent.startsWith('data:')}
                  fileName={msg.fileName}
                  setPreviewMedia={setPreviewMedia}
                  setIsImagePreview={setIsImagePreview}
                  receiver={receiver}
                  groupUsers={groupUsers}
                  hasValidContent={msg.hasValidContent}
                />
              )}
            </div>
          );
        })
      )}

      <div ref={scrollEnd}></div>

      {previewMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative p-2 bg-white dark:bg-[#2e2e2e] text-black dark:text-white rounded-lg max-w-xl max-h-[90vh] overflow-auto">
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute top-2 right-2 text-black dark:text-white font-bold text-xl hover:text-red-500"
            >
              ✖
            </button>
            {isImagePreview ? (
              <img src={previewMedia} className="max-w-full max-h-[80vh]" alt="preview" />
            ) : (
              <iframe src={previewMedia} className="w-[80vw] h-[70vh]" title="file" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbody;