import React, { useEffect, useRef, useState } from 'react';
import {
    MdOutlineDeleteOutline,
    MdOutlineVolumeOff,
    MdOutlineInventory2,
} from 'react-icons/md';
import {
    IoCallOutline,
    IoVideocamOutline,
    IoPersonOutline,
    IoSearchOutline,
} from 'react-icons/io5';
import { BsThreeDots } from 'react-icons/bs';
import { AudioCallModal, VideoCallModal, SearchBox } from './CallPopup'

function Header({ selectUser, isTyping, selectGroup, onProfileClick }) {

    // console.log('✌️selectUser --->', selectUser);
    // console.log('✌️selectGroup --->', selectGroup);
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [showCallModal, setShowCallModal] = useState(false); //Aduiocall
    const [showVideoModal, setShowVideoModal] = useState(false); // Video call modal
    const [callData, setCallData] = useState(null);
    const [showSearchBox, setShowSearchBox] = useState(false);
    // console.log('✌️showVideoModal --->', showVideoModal);
    // console.log('✌️showCallModal --->', showCallModal);


    const topItems = [
        { id: 1, icon: <IoSearchOutline />, title: 'Search' },
        { id: 2, icon: <IoCallOutline />, title: 'Call' },
        { id: 3, icon: <IoVideocamOutline />, title: 'Video Call' },
        { id: 4, icon: <IoPersonOutline />, title: 'Profile' },
    ];

    const dotUpsideItems = [
        { id: 1, icon: <MdOutlineInventory2 />, title: 'Archive' },
        { id: 2, icon: <MdOutlineVolumeOff />, title: 'Mute' },
        { id: 3, icon: <MdOutlineDeleteOutline />, title: 'Delete' },
    ];

    const dotmenuRef = useRef();

    useEffect(() => {
        const handleClickAnywhere = (event) => {
            if (showMoreOptions && dotmenuRef.current && !dotmenuRef.current.contains(event.target)) {
                setShowMoreOptions(false);

            }
        };

        document.addEventListener('mousedown', handleClickAnywhere);
        return () => {
            document.removeEventListener('mousedown', handleClickAnywhere);
        };
    }, [showMoreOptions]);

    const isUserSelected = selectUser && Object.keys(selectUser).length > 0;
    const isGroupSelected = selectGroup && Object.keys(selectGroup).length > 0;

    //user header if user is selected
    if (isUserSelected) {
        return (
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-white">
                <div className="flex items-center space-x-3"
                    onClick={onProfileClick}>
                    <img
                        className="w-12 h-12 rounded-full object-cover"
                        alt={`${selectUser.firstname} ${selectUser.lastname}`}
                        src={selectUser.img || selectUser.profile_avatar || 'https://via.placeholder.com/40'}
                    />
                    <div className="text-gray-900">
                        <div className="flex items-center gap-2 font-semibold">
                            <span>{`${selectUser.firstname} ${selectUser.lastname}`}</span>
                            {selectUser.online && (
                                <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                            )}
                        </div>
                        {isTyping && <span className="text-sm text-gray-500">typing...</span>}
                    </div>
                </div>

                <div className="flex items-center gap-7 text-gray-500 text-xl ">
                    {topItems.map(({ id, icon, title }) => (
                        <button
                            key={id}
                            title={title}
                            className="hover:text-blue-600 cursor-pointer"
                            type="button"
                            onClick={() => {
                                if (title === 'Call') {
                                    setCallData(isUserSelected ? selectUser : selectGroup);
                                    setShowCallModal(true);
                                } else if (title === 'Video Call') {
                                    setShowVideoModal(true);
                                    setCallData(isUserSelected ? selectUser : selectGroup);
                                } else if (title === 'Search') {
                                    setShowSearchBox(true)
                                } else if (title === 'Profile') {
                                    onProfileClick();
                                }
                            }}
                        >
                            {icon}
                        </button>
                    ))}
                    <div className="relative">
                        <button
                            onClick={() => setShowMoreOptions((prev) => !prev)}
                            title="More"
                            className="hover:text-black cursor-pointer mr-5"
                            type="button"
                        >
                            <BsThreeDots />
                        </button>
                        {showMoreOptions && (
                            <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10 text-sm text-gray-700"
                                ref={dotmenuRef}>
                                {dotUpsideItems.map(({ id, icon, title }) => (
                                    <button
                                        key={id}
                                        className="flex items-center justify-between w-full px-4 py-2 gap-2 hover:bg-gray-100"
                                        onClick={() => setShowMoreOptions(false)}
                                        type="button"
                                    >
                                        <span>{title}</span>
                                        <span className="text-blue-500 text-base">{icon}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Audio Call Modal */}
                {showCallModal && (
                    <AudioCallModal
                        user={callData}
                        onCancel={() => setShowCallModal(false)}
                        onCall={() => {
                            setShowCallModal(false);
                            // console.log('Calling:', callData);

                        }}
                    />
                )}
                {/* Video Call Modal */}
                {showVideoModal && (
                    <VideoCallModal
                        user={callData}
                        onCancel={() => setShowVideoModal(false)}
                        onCall={() => {
                            setShowVideoModal(false);
                            // console.log('Video calling:', callData);
                        }}
                    />
                )}
                {/* serchbox Modal */}
                {showSearchBox && (
                    <SearchBox onClose={() => setShowSearchBox(false)}
                        onSearch={(value) => {
                            console.log('🔍 Search Payload:', value);
                        }} />
                )}
            </div>
        );
    }

    //  group header if group is selected
    if (isGroupSelected) {
        return (
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-white">
                <div className="flex items-center space-x-3"
                    onClick={onProfileClick}>
                    <img
                        className="w-12 h-12 rounded-full object-cover"
                        alt={selectGroup.groupName}
                        src={'https://via.placeholder.com/40?text=G'}
                    />
                    <div className="text-gray-900">
                        <div className="flex items-center gap-2 font-semibold">
                            <span>{selectGroup.groupName}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                            Created by: {selectGroup.createdBy.firstname} {selectGroup.createdBy.lastname}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-7 text-gray-500 text-xl">
                    {topItems.map(({ id, icon, title }) => (
                        <button key={id} title={title} className="hover:text-blue-600 " type="button">
                            {icon}
                        </button>
                    ))}
                    <div className="relative">
                        <button
                            onClick={() => setShowMoreOptions((prev) => !prev)}
                            title="More"
                            className="hover:text-black cursor-pointer mr-5"
                            type="button"
                        >
                            <BsThreeDots />
                        </button>
                        {showMoreOptions && (
                            <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10 text-sm text-gray-700">
                                {dotUpsideItems.map(({ id, icon, title }) => (
                                    <button
                                        key={id}
                                        className="flex items-center justify-between w-full px-4 py-2 gap-2 hover:bg-gray-100"
                                        onClick={() => setShowMoreOptions(false)}
                                        type="button"
                                    >
                                        <span>{title}</span>
                                        <span className="text-blue-500 text-base">{icon}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

export default Header;


