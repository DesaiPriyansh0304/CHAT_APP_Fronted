import React, { useRef, useEffect, useState } from "react";
import { SenderMessage, ReceiverMessage } from "../Rigthsidebar/Messageui"


const Chatbody = ({
    messages,
    user,
    scrollEnd,
    loadingHistory,
    fetchOlderMessages,
    sender,
    receiver,
    groupUsers,
    currentPage,
    totalPages,
}) => {
    console.log("🔢 Chatbody pagination:", { currentPage, totalPages });
    // console.log("receiver", receiver)
    // console.log('✌️user --->', sender);
    // console.log('✌️messages --->', messages);
    const containerRef = useRef(null);
    const [previewMedia, setPreviewMedia] = useState(null);
    const [isImagePreview, setIsImagePreview] = useState(true);


    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = async () => {
            if (container.scrollTop < 100 && !loadingHistory && currentPage < totalPages) {
                const previousScrollHeight = container.scrollHeight;

                await fetchOlderMessages(); // Make sure it's awaited if possible

                // Use requestAnimationFrame to wait until render is complete
                requestAnimationFrame(() => {
                    const newScrollHeight = container.scrollHeight;
                    container.scrollTop = newScrollHeight - previousScrollHeight;
                });
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [loadingHistory, fetchOlderMessages, currentPage, totalPages]);


    useEffect(() => {
        console.log("🔢 currentPage:", currentPage, "totalPages:", totalPages);
    }, [currentPage, totalPages]);


    let lastSenderId = null;
    let lastDate = null;

    return (
        <div
            ref={containerRef}
            className="h-full w-full overflow-y-auto px-4 py-2 space-y-2 bg-gray-50"
        >
            {loadingHistory && (
                <div className="text-center text-gray-500 text-sm py-2">
                    Loading more messages...
                </div>
            )}

            {messages.map((msg, idx) => {
                const currentUserId = String(user._id || user.userId);
                const senderId = String(msg.senderId);
                const isSender = senderId === currentUserId;

                const contentArray = Array.isArray(msg.content) ? msg.content : [msg.content];
                const firstContent = contentArray[0] || "";
                console.log('✌️firstContent --->', firstContent);

                const messageText = msg.text || "";
                const messageType = msg.type || "text";
                const messageContent = Array.isArray(msg.content)
                    ? msg.content[0]
                    : msg.content || msg.image || msg.file || '';
                // const messageText = msg.text || msg.content || "";
                // const messageType = msg.type || "text";
                // const messageContent = msg.content || msg.image || msg.file || "";
                const fileName = msg.fileName || "Download File";

                // const isImage = messageType === "image" && messageContent.startsWith("http");
                const isImage = messageType === "image" && typeof messageContent === 'string' && messageContent.startsWith("http");
                // console.log('✌️isImage --->', isImage);
                // const isImageBase64 = messageType === "image" && messageContent.startsWith("data:image/");
                const isImageBase64 = messageType === "image" && typeof messageContent === 'string' && messageContent.startsWith("data:image/");
                // const isFile = messageType === "file" && messageContent.startsWith("http");
                const isFile = messageType === "file" && typeof messageContent === 'string' && messageContent.startsWith("http");
                // const isFileBase64 = messageType === "file" && messageContent.startsWith("data:");
                const isFileBase64 = messageType === "file" && typeof messageContent === 'string' && messageContent.startsWith("data:");
                // const hasText = messageText.trim() !== "";
                const hasText = typeof messageText === "string" && messageText.trim() !== "";
                const hasValidContent = contentArray.some((item) => typeof item === "string" && item.trim() !== "");
                // console.log('✌️hasText --->', hasText);
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
                    <div className="relative p-2 bg-white rounded-lg max-w-xl max-h-[90vh] overflow-auto">
                        <button
                            onClick={() => setPreviewMedia(null)}
                            className="absolute top-2 right-2 text-black font-bold"
                        >
                            ✖
                        </button>
                        {isImagePreview ? (
                            <img
                                src={previewMedia}
                                className="max-w-full max-h-[80vh]"
                                alt="preview"
                            />
                        ) : (
                            <iframe
                                src={previewMedia}
                                className="w-[80vw] h-[70vh]"
                                title="file"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbody;
