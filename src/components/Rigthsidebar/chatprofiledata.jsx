import React, { useState } from "react";
import { IoImagesOutline } from "react-icons/io5";
import { ImFileText2 } from "react-icons/im";
import { useSelector } from "react-redux";

// Tabs data
const tabs = [
    { icon: <IoImagesOutline />, label: "Image" },
    { icon: <ImFileText2 />, label: "File" },
];

const RightProfilePanel = ({ userData, isGroup, onClose }) => {

    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    const { messages } = useSelector(state => state.chatHistory)
    console.log('✌️messages --->', messages);

    const isImage = (url) => /\.(jpg|jpeg|png|gif)$/i.test(url);



    return (
        <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-lg border-l border-gray-200 z-50 overflow-y-auto">
            {/* Close Button */}
            <div className="p-2 text-right">
                <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">✕</button>
            </div>

            {/* Profile Info */}
            <div className="p-4 text-gray-800">
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
                {!isGroup && <p className="text-center text-green-600 mb-2">Active</p>}
                <p className="text-sm italic text-center">{userData.bio}</p>

                {/* Tabs Motion Section */}
                <div className="w-full border border-amber-300 mt-2.5">
                    {/* Tabs */}
                    <nav className="border-b">
                        <ul className="flex">
                            {tabs.map((item) => (
                                <li
                                    key={item.label}
                                    onClick={() => setSelectedTab(item)}
                                    className={`px-4 py-2 cursor-pointer font-medium rounded-t 
                ${selectedTab.label === item.label
                                            ? "bg-gray-200"
                                            : "bg-white"
                                        }`}
                                >
                                    <span className="flex items-center gap-1">{item.icon} {item.label}</span>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Content */}
                    <main className="w-full">
                        {/* Image Tab */}
                        {selectedTab.label === "Image" && (
                            <div className="grid grid-cols-3 gap-2 p-2">
                                {messages.flatMap((msg, index) =>
                                    (Array.isArray(msg.content) ? msg.content : [msg.content])
                                        .filter(isImage)
                                        .map((img, i) => (
                                            <img
                                                key={`${index}-${i}`}
                                                src={img}
                                                alt="img"
                                                className="w-full h-20 object-cover rounded"
                                            />
                                        ))
                                )}
                                {messages.length === 0 && (
                                    <p className="text-gray-400 col-span-3 text-center text-2xl">
                                        No images found
                                    </p>
                                )}
                            </div>
                        )}

                        {/* File Tab */}
                        {selectedTab.label === "File" && (
                            <div className="p-2 space-y-2">
                                {messages.flatMap((msg, index) =>
                                    (Array.isArray(msg.content) ? msg.content : [msg.content])
                                        .filter((c) => !isImage(c))
                                        .map((file, i) => (
                                            <div
                                                key={`${index}-${i}`}
                                                className="bg-gray-100 p-2 rounded flex items-center justify-between"
                                            >
                                                {/* <span className="truncate text-sm">{file.split("/").pop()}</span> */}
                                                <a
                                                    href={file}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 text-sm"
                                                >
                                                    Download
                                                </a>
                                            </div>
                                        ))
                                )}
                                {messages.length === 0 && (
                                    <p className="text-gray-400 text-2xl text-center">No files found</p>
                                )}
                            </div>
                        )}
                    </main>
                </div>

            </div>
        </div>
    );
};

export default RightProfilePanel;
