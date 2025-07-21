import React, { useRef, useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { selectFilteredMessages } from '../../feature/Slice/ChatHistory';
import { SenderMessage, ReceiverMessage } from "../Rigthsidebar/Messageui";

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

    const currentUserId = String(user._id || user.userId);
    const selectedUserId = selectUser?._id;
    const selectedGroupId = selectGroup?._id;

    // Filter messages for private or group chat
    const messages = allMessages.filter((msg) => {
        const senderId = String(msg.senderId);
        const receiverId = String(msg.receiverId);
        const groupId = msg.groupId;

        if (selectUser) {
            return (
                (senderId === currentUserId && receiverId === selectedUserId) ||
                (senderId === selectedUserId && receiverId === currentUserId)
            );
        } else if (selectGroup) {
            return groupId === selectedGroupId;
        }
        return false;
    });

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
        <div ref={containerRef} className="h-full w-full overflow-y-auto px-4 py-2 space-y-2 bg-gray-50 dark:bg-[#222831] transition-colors duration-300">
            {messages.map((msg, idx) => {
                const senderId = String(msg.senderId);
                const isSender = senderId === currentUserId;

                const contentArray = Array.isArray(msg.content) ? msg.content : [msg.content];
                const firstContent = contentArray[0] || "";
                console.log('✌️firstContent --->', firstContent);

                const messageText = msg.text || "";
                const messageType = msg.type || "text";
                const messageContent = Array.isArray(msg.content) ? msg.content[0] : msg.content || msg.image || msg.file || '';
                const fileName = msg.fileName || "Download File";

                const isImage = messageType === "image" && typeof messageContent === 'string' && messageContent.startsWith("http");
                const isImageBase64 = messageType === "image" && typeof messageContent === 'string' && messageContent.startsWith("data:image/");
                const isFile = messageType === "file" && typeof messageContent === 'string' && messageContent.startsWith("http");
                const isFileBase64 = messageType === "file" && typeof messageContent === 'string' && messageContent.startsWith("data:");
                const hasText = typeof messageText === "string" && messageText.trim() !== "";
                const hasValidContent = contentArray.some((item) => typeof item === "string" && item.trim() !== "");
                if (!hasText && !hasValidContent) return null;

                const messageDate = new Date(msg.createdAt).toDateString();
                const showGroupHeader = senderId !== lastSenderId || messageDate !== lastDate;

                if (showGroupHeader) {
                    lastSenderId = senderId;
                    lastDate = messageDate;
                }

                return (
                    <div key={idx} className="flex flex-col">
                        {isSender ? (
                            <SenderMessage
                                msg={msg}
                                messageDate={messageDate}
                                messageText={messageText}
                                messageContent={messageContent}
                                hasText={hasText}
                                isImage={isImage}
                                isImageBase64={isImageBase64}
                                isFile={isFile}
                                isFileBase64={isFileBase64}
                                fileName={fileName}
                                setPreviewMedia={setPreviewMedia}
                                setIsImagePreview={setIsImagePreview}
                                sender={sender}
                                groupUsers={groupUsers}
                            />
                        ) : (
                            <ReceiverMessage
                                msg={msg}
                                messageDate={messageDate}
                                messageText={messageText}
                                messageContent={messageContent}
                                hasText={hasText}
                                isImage={isImage}
                                isImageBase64={isImageBase64}
                                isFile={isFile}
                                isFileBase64={isFileBase64}
                                fileName={fileName}
                                setPreviewMedia={setPreviewMedia}
                                setIsImagePreview={setIsImagePreview}
                                receiver={receiver}
                                groupUsers={groupUsers}
                                hasValidContent={hasValidContent}
                            />
                        )}
                    </div>
                );
            })}
            <div ref={scrollEnd}></div>

            {previewMedia && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="relative p-2 bg-white dark:bg-[#2e2e2e] text-black dark:text-white rounded-lg max-w-xl max-h-[90vh] overflow-auto">
                        <button
                            onClick={() => setPreviewMedia(null)}
                            className="absolute top-2 right-2 text-black dark:text-white font-bold"
                        >✖</button>
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
