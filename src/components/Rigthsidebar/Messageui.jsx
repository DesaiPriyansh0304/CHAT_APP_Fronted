import React, { useEffect, useRef, useState } from 'react';
import { FaFileAlt } from 'react-icons/fa';
// import { format } from "timeago.js";
// import { format } from "timeago.js";
import { IoTimeOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { RxDotsVertical } from 'react-icons/rx';
//dot menu
import { RiDeleteBin6Line, RiSaveLine, RiShareForwardBoxFill } from 'react-icons/ri';
import { BsCopy, BsCheck, BsCheckAll } from 'react-icons/bs';
import toast from 'react-hot-toast';
import { selectOnlineUsers } from '../../feature/Slice/Socket/OnlineuserSlice';
// import { FaFileAlt } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { HiDotsHorizontal } from 'react-icons/hi';
//file ui
import { LuFileText } from "react-icons/lu";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import FileTypeIcon from "./FileTypeIcon";

/* --------------------- SENDER MESSAGE --------------------- */
export const SenderMessage = ({
  msg,
  messageText,
  messageContent,
  hasText,
  isImage,
  isImageBase64,
  isFile,
  isFileBase64,
  fileName,
  setPreviewMedia,
  setIsImagePreview,
}) => {
  // Login User Slice
  const AuthUserState = useSelector((state) => state.AuthUser || {});
  const { userData: user } = AuthUserState;

  const onlineUsers = useSelector(selectOnlineUsers);

  const receiverId = msg.receiverId?._id || msg.receiverId;
  const seenBy = msg.seenBy || [];
  const isSeen = seenBy.includes(receiverId);
  const isReceiverOnline = onlineUsers.includes(receiverId);
  // console.log('receiverId --->Messageui/SenderMessage', receiverId);
  // console.log('seenBy --->Messageui/SenderMessage', seenBy);
  // console.log('isSeen --->Messageui/SenderMessage', isSeen);
  // console.log('isReceiverOnline --->Messageui/SenderMessage', isReceiverOnline);

  // ✅Tick logic
  let tickIcon = <BsCheck className="text-gray-500" />; // Sent
  if (isSeen) {
    tickIcon = <BsCheckAll className="text-blue-500" />; // Seen
  } else if (isReceiverOnline) {
    tickIcon = <BsCheckAll className="text-gray-500" />; // Delivered
  }

  return (
    <>
      <div className="flex flex-col self-end">
        <div className="flex flex-row gap-1">
          {/* Dot menu */}
          <div className="justify-start text-gray-500 mt-1">
            <DotMenu
              messageText={messageText}
              messageContent={messageContent}
              hasText={hasText}
              isImage={isImage || isImageBase64}
              isFile={isFile || isFileBase64}
              position="right"
              onOptionClick={(option) => {
                console.log("Sender Option Selected:", option);
              }}
            />
          </div>

          {/* Chat data */}
          <div className="inline-block">
            <ul>
              <li className="relative">
                {/* Chat bubble */}
                <div className="relative inline-block max-w-xs px-4 py-2 rounded-lg bg-[#F5F7FB] text-gray-600">
                  {/* Message text */}
                  {hasText && (
                    <p className="whitespace-pre-wrap break-words">{messageText}</p>
                  )}

                  {/* Images */}
                  {(isImage || isImageBase64) && !isFile &&
                    Array.isArray(msg.content) &&
                    msg.content.map((url, i) => (
                      <div key={i} className="relative inline-block mt-2">
                        <img
                          src={url}
                          alt={`sent-img-${i}`}
                          className="max-h-48 rounded-lg border cursor-pointer"
                          onClick={() => {
                            setPreviewMedia(url);
                            setIsImagePreview(true);
                          }}
                        />

                        {/* Icon Container */}
                        <div className="absolute bottom-2 right-2 flex gap-2">
                          {/* Download Icon */}
                          <a
                            href={url}
                            download={`image-${i + 1}`}
                            className="bg-white p-1 rounded-full shadow-md cursor-pointer"
                            onClick={(e) => e.stopPropagation()} // prevent preview
                          >
                            <LuDownload className="text-black text-lg" />
                          </a>

                          {/* Horizontal Dots Icon */}
                          <button
                            className="bg-white p-1 rounded-full shadow-md cursor-pointer"
                            onClick={(e) => e.stopPropagation()} // prevent preview
                          >
                            <HiDotsHorizontal className="text-black text-lg" />
                          </button>
                        </div>
                      </div>
                    ))}


                  {/* Files */}
                  {(isFile || isFileBase64) && !isImage &&
                    Array.isArray(msg.content) &&
                    msg.content.map((url, i) => (
                      <div
                        key={i}
                        className="mt-2 flex items-center justify-between bg-white rounded-lg p-2 shadow-sm"
                      >
                        {/* File Icon + Name */}
                        <div
                          className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                          onClick={() => {
                            setPreviewMedia(url);
                            setIsImagePreview(false);
                          }}
                        >
                          {/* File Icon */}
                          <FileTypeIcon
                            fileName={Array.isArray(msg.fileName) ? msg.fileName[i] : fileName}
                          />

                          {/* File Name + Size */}
                          <div className="flex flex-col truncate">
                            <span className="font-medium text-sm truncate">
                              {Array.isArray(msg.fileName)
                                ? msg.fileName[i]
                                : fileName || `File ${i + 1}`}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                              {msg.fileSize ? msg.fileSize : "Unknown size"}
                            </span>
                          </div>
                        </div>

                        {/* Actions (Download + Menu) */}
                        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                          <a href={url} download>
                            <LuDownload className="text-gray-500 text-lg hover:scale-105 hover:text-blue-600" />
                          </a>
                          <HiOutlineDotsHorizontal className="text-gray-500 text-lg cursor-pointer  hover:scale-105 hover:text-blue-600" />
                        </div>
                      </div>
                    ))}



                  {/* Time + Tick */}
                  <div className="flex flex-row items-center mt-1.5 justify-between w-full">
                    {/* Time + Icon */}
                    <div className="flex items-center gap-0.5">
                      <IoTimeOutline className="text-black text-xs" />
                      <span className="text-black text-xs">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>

                    {/* Tick icon */}
                    <div className="text-sm ml-1">
                      {tickIcon}
                    </div>
                  </div>


                  {/* Tail */}
                  <div className="absolute bottom-0 right-[-4px] mr-[17px] mb-[-5px] w-3 h-3 bg-[#F5F7FB] dark:bg-[#2e2e2e] rotate-45 "></div>
                </div>

                {/* Sender Name */}
                <div className="text-xs text-gray-500 dark:text-[var(--text-color)] mt-1.5 text-right">
                  {user?.firstname} {user?.lastname}
                </div>
              </li>
            </ul>
          </div>

          {/* Sender avatar */}
          <div className="w-11 h-11 rounded-full overflow-hidden self-end">
            {user.profile_avatar ? (
              <img
                src={user.profile_avatar}
                alt={user.firstname}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>
                {user.firstname?.[0]?.toUpperCase()}
                {user.lastname?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};


const isLikelyURL = (text) => /^https?:\/\//.test(text);
/* --------------------- RECEIVER MESSAGE --------------------- */
export const ReceiverMessage = ({
  msg,
  groupUsers,
  selectUser,
  receiver,
  messageText,
  messageContent,
  hasText,
  hasValidContent,
  isImage,
  isImageBase64,
  isFile,
  isFileBase64,
  fileName,
  setPreviewMedia,
  setIsImagePreview,
}) => {
  let senderName = '';
  const senderId = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;

  if (groupUsers?.length) {
    const foundUser = groupUsers.find((u) => {
      const uid = u?.user?._id || u?.user?.userId;
      return String(uid) === String(senderId);
    });
    if (foundUser?.user) {
      senderName = `${foundUser.user.firstname || ''} ${foundUser.user.lastname || ''}`.trim();
    }
  }
  if (!senderName && receiver) senderName = `${receiver.firstname || ''} ${receiver.lastname || ''}`.trim();
  if (!senderName) senderName = 'Unknown User';

  return (
    <div className="flex flex-col self-start text-right">
      <div className="flex flex-row gap-1">
        {/* Sender avatar */}
        <div className="w-11 h-11 rounded-full overflow-hidden self-end">
          {(() => {
            let avatar = '', fname = '', lname = '';
            if (groupUsers?.length) {
              const foundUser = groupUsers.find((u) => {
                const uid = u?.user?._id || u?.user?.userId;
                return String(uid) === String(senderId);
              });
              if (foundUser?.user) {
                avatar = foundUser.user.profile_avatar;
                fname = foundUser.user.firstname;
                lname = foundUser.user.lastname;
              }
            }
            if (!avatar && receiver) {
              avatar = receiver.profile_avatar;
              fname = receiver.firstname;
              lname = receiver.lastname;
            }
            return avatar ? (
              <img src={avatar} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white font-semibold text-lg">
                {fname?.[0]?.toUpperCase() || '?'}{lname?.[0]?.toUpperCase() || ''}
              </div>
            );
          })()}
        </div>

        {/* Chat bubble */}
        <div className="inline-block">
          <ul>
            <li className="relative">
              <div className="relative inline-block max-w-xs px-4 py-2 rounded-xl bg-gray-300 text-gray-600">
                {/* Text */}
                {hasText && !isLikelyURL(messageText) && <p className="whitespace-pre-wrap break-words">{messageText}</p>}

                {/* Images */}
                {hasValidContent && (isImage || isImageBase64) && Array.isArray(msg.content) &&
                  msg.content.map((url, i) => (
                    <div key={i} className="relative inline-block mt-2">
                      <img
                        src={url}
                        alt={`received-img-${i}`}
                        className="max-h-48 rounded-lg border cursor-pointer"
                        onClick={() => {
                          setPreviewMedia(url);
                          setIsImagePreview(true);
                        }}
                      />
                      <a
                        href={url}
                        download={`image-${i + 1}`}
                        className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <LuDownload className="text-black text-lg" />
                      </a>
                    </div>
                  ))}

                {/* Files (SAME UI AS SENDER) */}
                {hasValidContent && (isFile || isFileBase64) && Array.isArray(msg.content) &&
                  msg.content.map((url, i) => (
                    <div
                      key={i}
                      className="mt-2 flex items-center justify-between bg-white rounded-lg p-2 shadow-sm"
                    >
                      <div
                        className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                        onClick={() => {
                          setPreviewMedia(url);
                          setIsImagePreview(false);
                        }}
                      >
                        <FileTypeIcon
                          fileName={Array.isArray(msg.fileName) ? msg.fileName[i] : fileName}
                        />
                        <div className="flex flex-col truncate">
                          <span className="font-medium text-sm truncate">
                            {Array.isArray(msg.fileName) ? msg.fileName[i] : fileName || `File ${i + 1}`}
                          </span>
                          <span className="text-xs text-gray-500 truncate">
                            {msg.fileSize ? msg.fileSize : "Unknown size"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                        <a href={url} download>
                          <LuDownload className="text-gray-500 text-lg hover:scale-105 hover:text-blue-600" />
                        </a>
                        <HiOutlineDotsHorizontal className="text-gray-500 text-lg cursor-pointer hover:scale-105 hover:text-blue-600" />
                      </div>
                    </div>
                  ))}

                {/* Timestamp */}
                <div className="flex flex-row gap-1.5 items-center mt-1.5 justify-end">
                  <IoTimeOutline className="text-black text-xs" />
                  <span className="text-black text-xs">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </span>
                </div>

                {/* Tail pointer */}
                <div className="absolute bottom-0 left-[-1px] ml-[17px] mb-[-6px] w-3 h-3 bg-gray-300 rotate-45"></div>
              </div>

              {/* Sender name */}
              <div className="text-xs text-gray-500 mt-1.5 text-left">{senderName}</div>
            </li>
          </ul>
        </div>
        <div className="justify-start text-gray-500 mt-1">
          <DotMenu
            messageText={messageText}
            messageContent={messageContent}
            hasText={hasText}
            isImage={isImage || isImageBase64}
            isFile={isFile || isFileBase64}
            position="left"
            onOptionClick={(option) => { console.log('Receiver Option Selected:', option); }} />
        </div>
      </div>
    </div>
  );
};



//dot menu
export const DotMenu = ({
  onOptionClick,
  position = 'right',
  messageText,
  messageContent,
  hasText,
  isImage,
  isFile,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dotmenuRef = useRef();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const dotMenu = [
    { id: 0, title: 'Copy', icon: <BsCopy /> },
    { id: 1, title: 'Save', icon: <RiSaveLine /> },
    { id: 2, title: 'Forward', icon: <RiShareForwardBoxFill /> },
    { id: 3, title: 'Delete', icon: <RiDeleteBin6Line /> },
  ];

  const handleItemClick = (item) => {
    if (item.title === 'Copy') {
      handleCopy();
    }
    onOptionClick?.(item);
    setIsMenuOpen(false);
  };
  //copy function
  const handleCopy = async () => {
    try {
      if (hasText && messageText) {
        await navigator.clipboard.writeText(messageText);
        toast.success('✅ Text copied to clipboard!');
      } else if (isImage || isFile) {
        await navigator.clipboard.writeText(messageContent);
        toast.success('✅ Link copied to clipboard!');
      } else {
        toast.worning('⚠️ Nothing to copy.');
      }
    } catch (error) {
      console.log('❌ Copy failed', error);
      toast.error('❌ Failed to copy.');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && dotmenuRef.current && !dotmenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className="relative" ref={dotmenuRef}>
      <RxDotsVertical onClick={toggleMenu} className="text-gray-500 cursor-pointer" />
      {isMenuOpen && (
        <div
          className={`absolute z-10 mt-2 w-32 bg-white rounded shadow-lg  text-sm ${position === 'left' ? 'left-0' : 'right-0'
            }`}
        >
          <ul>
            {dotMenu.map((item) => (
              <li
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="flex items-center gap-1.5 px-4 py-1.5 hover:bg-gray-100 cursor-pointer justify-between mx-1"
              >
                <div className="text-gray-700 text-md">{item.title}</div>
                <div className="text-blue-500">{item.icon}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
