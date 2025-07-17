import React, { useState } from "react";
import { IoImagesOutline, IoSettingsOutline } from "react-icons/io5";
import { ImFileText2 } from "react-icons/im";
import { MdFavoriteBorder } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { addFavorite } from "../../feature/Slice/favoriteSlice.js";
import toast from "react-hot-toast";

// Tabs data
const tabs = [
    { icon: <IoImagesOutline />, label: "Image" },
    { icon: <ImFileText2 />, label: "File" },
    { icon: <IoSettingsOutline />, label: "Setting" },
];

// File type definitions
const fileTypes = [
    { type: "All", extensions: [], color: "text-black dark:text-white" },
    { type: "PDF", extensions: ["pdf"], color: "text-red-500" },
    { type: "Word", extensions: ["doc", "docx"], color: "text-blue-500" },
    { type: "Excel", extensions: ["xls", "xlsx"], color: "text-green-500" },
    { type: "PowerPoint", extensions: ["ppt", "pptx"], color: "text-orange-500" },
    { type: "Archive", extensions: ["zip", "rar"], color: "text-yellow-500" },
    { type: "Other", extensions: [], color: "text-gray-500 dark:text-gray-400" },
];

const RightProfilePanel = ({ userData, isGroup, onClose }) => {
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    const [selectedFileType, setSelectedFileType] = useState("All");
    const { messages } = useSelector((state) => state.chatHistory);
    const dispatch = useDispatch();

    const isImage = (url) => /\.(jpg|jpeg|png|gif)$/i.test(url);

    const getFilteredFiles = () => {
        const allFiles = messages.flatMap((msg) =>
            (Array.isArray(msg.content) ? msg.content : [msg.content])
                .filter((c) => typeof c === "string" && c.trim() !== "" && !isImage(c))
        );

        if (selectedFileType === "All") return allFiles;

        const extList = fileTypes.find((f) => f.type === selectedFileType)?.extensions || [];

        return allFiles.filter((file) =>
            extList.length > 0 ? extList.includes(file.split(".").pop().toLowerCase()) : false
        );
    };

    const handleFavoriteClick = async (messageId, chatType, content) => {
        const payload = {
            messageId,
            chatType,
            content,
            type: "image",
        };

        try {
            const res = await dispatch(addFavorite(payload));
            if (res?.payload?.msg) {
                toast.success(res.payload.msg);
            } else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.log('✌️error --->', error);
            toast.error("Failed to favorite image");
        }
    };

    return (
        <div className="absolute top-0 right-0 h-full w-100 bg-white dark:bg-gray-900 shadow-lg border-l border-gray-200 dark:border-gray-700 z-50 overflow-y-auto">
            {/* Close Button */}
            <div className="p-2 text-right">
                <button onClick={onClose} className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white text-xl">✕</button>
            </div>

            {/* Profile Info */}
            <div className="p-4 text-gray-800 dark:text-gray-100">
                <div>
                    <img
                        src={userData.img || userData.profile_avatar || 'https://via.placeholder.com/100'}
                        className="w-24 h-24 rounded-full mx-auto mb-4"
                        alt="Profile"
                    />
                </div>
                <h3 className="text-center font-semibold text-xl mb-2">
                    {isGroup ? userData.groupName : `${userData.firstname} ${userData.lastname}`}
                </h3>
                {!isGroup && <p className="text-center text-green-500 mb-2">Active</p>}
                <p className="text-sm italic text-center text-gray-600 dark:text-gray-400">{userData.bio}</p>

                {/* Tabs */}
                <div className="w-full border border-amber-300 mt-3 rounded-md dark:border-amber-700">
                    <ul className="flex px-1.5 py-1.5 list-none bg-slate-100 dark:bg-gray-800 rounded-md" role="list">
                        {tabs.map((item) => (
                            <li key={item.label} className="flex-auto text-center">
                                <button
                                    onClick={() => setSelectedTab(item)}
                                    className={`flex items-center justify-center w-full px-0 py-2 text-sm rounded-lg transition-all cursor-pointer ${selectedTab.label === item.label
                                        ? "text-black dark:text-white font-semibold bg-white dark:bg-gray-700 shadow"
                                        : "text-slate-700 dark:text-gray-300"
                                        }`}
                                    role="tab"
                                >
                                    <span className="ml-1 flex items-center gap-1">
                                        {item.icon}
                                        {item.label}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="w-full p-4">
                        {/* Image Tab */}
                        {selectedTab.label === "Image" && (
                            <>
                                {messages.length === 0 && (
                                    <p className="text-gray-400 text-center text-2xl">No images found</p>
                                )}

                                <div className="columns-2 md:columns-3 lg:columns-3 gap-4 space-y-3">
                                    {(() => {
                                        const grouped = [[], [], [], []];
                                        let imgIndex = 0;

                                        messages.forEach((msg) => {
                                            const contents = Array.isArray(msg.content) ? msg.content : [msg.content];
                                            contents.forEach((content) => {
                                                if (isImage(content)) {
                                                    grouped[imgIndex % 4].push({
                                                        img: content,
                                                        messageId: msg.messageId,
                                                        chatType: msg.chatType || (isGroup ? "group" : "private")
                                                    });
                                                    imgIndex++;
                                                }
                                            });
                                        });

                                        return grouped.map((colImages, colIndex) => (
                                            <div key={colIndex} className="grid gap-4">
                                                {colImages.map((imgData, i) => (
                                                    <div key={`${colIndex}-${i}`} className="relative group">
                                                        <img
                                                            src={imgData.img}
                                                            alt="gallery"
                                                            className="w-full h-auto rounded-lg object-cover"
                                                        />
                                                        <div
                                                            onClick={() => handleFavoriteClick(imgData.messageId, imgData.chatType, imgData.img)}
                                                            className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md cursor-pointer opacity-90 hover:opacity-100"
                                                        >
                                                            <MdFavoriteBorder size={20} className="text-red-500" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </>
                        )}

                        {/* File Tab */}
                        {selectedTab.label === "File" && (
                            <>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {fileTypes.map((ft) => (
                                        <button
                                            key={ft.type}
                                            onClick={() => setSelectedFileType(ft.type)}
                                            className={`px-3 py-1 text-sm rounded-full border ${selectedFileType === ft.type
                                                ? `${ft.color} border-black dark:border-white font-semibold`
                                                : 'text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600'
                                                }`}
                                        >
                                            {ft.type}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    {getFilteredFiles().length > 0 ? (
                                        getFilteredFiles().map((file, i) => {
                                            const filename = file.split("/").pop();
                                            const ext = filename.split('.').pop().toLowerCase();
                                            const fileType = fileTypes.find((f) => f.extensions.includes(ext)) || fileTypes.find(f => f.type === "Other");

                                            return (
                                                <div key={i} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-sm font-semibold ${fileType.color}`}>
                                                            {fileType.type}
                                                        </span>
                                                        <span className="truncate text-sm text-gray-700 dark:text-gray-300 max-w-[120px]">
                                                            {filename}
                                                        </span>
                                                    </div>
                                                    <a
                                                        href={file}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 text-sm"
                                                    >
                                                        Download
                                                    </a>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-gray-400 text-2xl text-center">
                                            No {selectedFileType} files found
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RightProfilePanel;
