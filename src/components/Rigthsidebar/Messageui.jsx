import React, { useEffect, useRef, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
// import { format } from "timeago.js";
import { IoTimeOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RxDotsVertical } from "react-icons/rx";
//dot menu
import { RiDeleteBin6Line, RiSaveLine, RiShareForwardBoxFill } from "react-icons/ri";
import { BsCopy } from "react-icons/bs";
import toast from 'react-hot-toast';


export const SenderMessage = ({
    msg,
    // sender,
    // messageDate,
    // groupUsers,
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
    const { userData: user } = useSelector((state) => state.loginuser);
    // console.log('✌️msg --->', msg);


    return (
        //main div
        <div className="flex flex-col self-end">
            {/*image and chatdata*/}
            <div className="flex flex-row gap-1">
                <div className="justify-start text-gray-500">
                    <DotMenu
                        messageText={messageText}
                        messageContent={messageContent}
                        hasText={hasText}
                        isImage={isImage || isImageBase64}
                        isFile={isFile || isFileBase64}
                        position="right" onOptionClick={(option) => {
                            console.log("Sender Option Selected:", option);
                        }} />
                    {/* <RxDotsVertical /> */}
                </div>
                {/*chat data And Time zone*/}
                <div className="inline-block">
                    <div>
                        <ul>

                            <li className="">
                                {/*chat message and time zone*/}
                                <div className="max-w-xs px-4 py-2 rounded-xl bg-gray-300 text-gray-600">
                                    {/*Chat Message*/}
                                    <div className="">

                                        {hasText && (
                                            <p className="whitespace-pre-wrap break-words">{messageText}</p>
                                        )}

                                        {/* {(isImage || isImageBase64) && (
                                            <img
                                                src={messageContent}
                                                alt="sent-img"
                                                className="mt-2 max-h-48 rounded-lg border cursor-pointer"
                                                onClick={() => {
                                                    setPreviewMedia(messageContent);
                                                    setIsImagePreview(true);
                                                }}
                                            />
                                        )} */}
                                        {(isImage || isImageBase64) && Array.isArray(msg.content) && msg.content.map((url, i) => (
                                            <img
                                                key={i}
                                                src={url}
                                                alt={`sent-img-${i}`}
                                                className="mt-2 max-h-48 rounded-lg border cursor-pointer"
                                                onClick={() => {
                                                    setPreviewMedia(url);
                                                    setIsImagePreview(true);
                                                }}
                                            />
                                        ))}

                                        {/* {(isFile || isFileBase64) && (
                                            <button
                                                onClick={() => {
                                                    setPreviewMedia(messageContent);
                                                    setIsImagePreview(false);
                                                }}
                                                className="mt-2 flex items-center gap-1 text-sm underline"
                                            >
                                                <FaFileAlt /> {fileName}
                                            </button>
                                        )} */}
                                        {(isFile || isFileBase64) && Array.isArray(msg.content) && msg.content.map((url, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setPreviewMedia(url);
                                                    setIsImagePreview(false);
                                                }}
                                                className="mt-2 flex items-center gap-1 text-sm underline"
                                            >
                                                <FaFileAlt /> {Array.isArray(msg.fileName) ? msg.fileName[i] : fileName || `File ${i + 1}`}
                                            </button>
                                        ))}
                                    </div>

                                    {/*time zone*/}
                                    <div className=" flex flex-row gap-1.5 items-center mt-1.5 justify-start">
                                        <div className="text-xs text-black">
                                            <IoTimeOutline />
                                        </div>
                                        <div className="text-black text-xs">
                                            {new Date(msg.createdAt).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
                                            })}
                                        </div>
                                    </div>


                                </div>
                                {/*sender Full Name*/}
                                <div className="text-xs text-gray-500 mt-1.5 text-right">
                                    {user?.firstname} {user?.lastname}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/*sender image*/}
                <div className="w-11 h-11 rounded-full overflow-hidden self-end">
                    {user.profile_avatar ? (
                        <img
                            src={user.profile_avatar}
                            alt={user.firstname}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className=''>
                            {user.firstname?.[0]?.toUpperCase()}
                            {user.lastname?.[0]?.toUpperCase()}
                        </span>
                    )}
                    {/* <img src={user?.profile_avatar} alt="" /> */}
                </div>
            </div>

            {/* <span className="text-xs text-gray-400 mt-1">
            {format(msg.createdAt)}
            </span> */}
        </div>
    )
};


const isLikelyURL = (text) => /^https?:\/\//.test(text);


export const ReceiverMessage = ({
    msg,
    groupUsers,
    receiver,
    messageText,
    // messageContent,
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
            return uid === senderId;
        });
        if (foundUser?.user) {
            senderName = `${foundUser.user.firstname} ${foundUser.user.lastname}`;
        }
    }

    if (!senderName && receiver) {
        senderName = `${receiver.firstname} ${receiver.lastname}`;
    }

    return (
        <div className="flex flex-col self-start text-left">
            <div className="flex flex-row gap-1">

                {/* Sender avatar */}
                <div className="w-11 h-11 rounded-full overflow-hidden self-end">
                    {(() => {
                        let avatar = '';
                        let fname = '';
                        let lname = '';

                        if (groupUsers?.length) {
                            const foundUser = groupUsers.find((u) => {
                                const uid = u?.user?._id || u?.user?.userId;
                                return uid === senderId;
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
                            <img
                                src={avatar}
                                alt="profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white font-semibold text-lg">
                                {fname?.[0]?.toUpperCase()}{lname?.[0]?.toUpperCase()}
                            </div>
                        );
                    })()}
                </div>

                <div className="inline-block">
                    <div>
                        <ul>
                            <li>
                                {(hasText || hasValidContent) && (
                                    <div className="max-w-xs px-4 py-2 rounded-xl bg-gray-300 text-gray-600">

                                        {/* Chat Text (filtered) */}
                                        {hasText && !isLikelyURL(messageText) && (
                                            <p className="whitespace-pre-wrap break-words">
                                                {messageText}
                                            </p>
                                        )}

                                        {/* Image Preview */}
                                        {(hasValidContent && (isImage || isImageBase64)) &&
                                            Array.isArray(msg.content) &&
                                            msg.content.map((url, i) => (
                                                <img
                                                    key={i}
                                                    src={url}
                                                    alt={`sent-img-${i}`}
                                                    className="mt-2 max-h-48 rounded-lg border cursor-pointer"
                                                    onClick={() => {
                                                        setPreviewMedia(url);
                                                        setIsImagePreview(true);
                                                    }}
                                                />
                                            ))}

                                        {/* File Preview */}
                                        {(hasValidContent && (isFile || isFileBase64)) &&
                                            Array.isArray(msg.content) &&
                                            msg.content.map((url, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        setPreviewMedia(url);
                                                        setIsImagePreview(false);
                                                    }}
                                                    className="mt-2 flex items-center gap-1 text-sm underline"
                                                >
                                                    <FaFileAlt /> {Array.isArray(msg.fileName) ? msg.fileName[i] : fileName || `File ${i + 1}`}
                                                </button>
                                            ))}

                                        {/* Timestamp */}
                                        <div className="flex flex-row gap-1.5 items-center mt-1.5 justify-end">
                                            <div className="text-xs text-black">
                                                <IoTimeOutline />
                                            </div>
                                            <div className="text-black text-xs">
                                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true,
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Sender name */}
                                <div className="text-xs text-gray-500 mt-1.5 text-left">
                                    {senderName || 'User'}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>


            </div>
        </div>
    );
};



//dot menu
export const DotMenu = ({
    onOptionClick,
    position = "right",
    messageText,
    messageContent,
    hasText,
    isImage,
    isFile }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dotmenuRef = useRef();

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    const dotMenu = [
        { id: 0, title: "Copy", icon: <BsCopy /> },
        { id: 1, title: "Save", icon: <RiSaveLine /> },
        { id: 2, title: "Forward", icon: <RiShareForwardBoxFill /> },
        { id: 3, title: "Delete", icon: <RiDeleteBin6Line /> },
    ];

    const handleItemClick = (item) => {
        if (item.title === "Copy") {
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
                toast.success("✅ Text copied to clipboard!");
            } else if (isImage || isFile) {
                await navigator.clipboard.writeText(messageContent);
                toast.success("✅ Link copied to clipboard!");
            } else {
                toast.worning("⚠️ Nothing to copy.");
            }
        } catch (err) {
            console.error("❌ Copy failed", err);
            toast.error("❌ Failed to copy.");
        }
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMenuOpen && dotmenuRef.current && !dotmenuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen]);

    return (
        <div className="relative" ref={dotmenuRef}>
            <RxDotsVertical
                onClick={toggleMenu}
                className="text-gray-500 cursor-pointer"
            />
            {isMenuOpen && (
                <div
                    className={`absolute z-10 mt-2 w-32 bg-white rounded shadow-lg  text-sm ${position === "left" ? "left-0" : "right-0"
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
