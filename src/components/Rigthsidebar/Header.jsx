import React, { useEffect, useRef, useState } from 'react';
import { MdOutlineDeleteOutline, MdOutlineVolumeOff, MdOutlineInventory2 } from 'react-icons/md';
import {
  IoCallOutline,
  IoVideocamOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoChevronBackOutline
} from 'react-icons/io5';
import { BsThreeDots } from 'react-icons/bs';
import { AudioCallModal, VideoCallModal, SearchBox } from './CallPopup';

function Header({ selectUser, isTyping, selectGroup, onProfileClick, isMobile, onMobileBack }) {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [callData, setCallData] = useState(null);
  const [showSearchBox, setShowSearchBox] = useState(false);

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

  const commonHeaderStyle =
    'flex items-center  p-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e]';
  const userNameText = 'text-gray-900 dark:text-white';
  const typingText = 'text-sm text-gray-500 dark:text-gray-400';
  const buttonTextColor = 'text-gray-500 dark:text-gray-300 text-xl';
  const hoverBtn = 'hover:text-blue-600 dark:hover:text-blue-400';

  const renderMoreMenu = () => (
    <div
      className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 text-sm text-gray-700 dark:text-gray-200"
      ref={dotmenuRef}
    >
      {dotUpsideItems.map(({ id, icon, title }) => (
        <button
          key={id}
          className="flex items-center justify-between w-full px-4 py-2 gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setShowMoreOptions(false)}
          type="button"
        >
          <span>{title}</span>
          <span className="text-blue-500 text-base">{icon}</span>
        </button>
      ))}
    </div>
  );

  if (isUserSelected) {
    return (
      <div className={commonHeaderStyle}>
        <div className="flex items-center space-x-3">
          {/* Mobile Back Button */}
          {isMobile && (
            <button
              onClick={onMobileBack}
              className="text-gray-500 dark:text-gray-300 text-xl hover:text-blue-600 dark:hover:text-blue-400 mr-3.5 cursor-pointer"
              title="Back"
            >
              <IoChevronBackOutline />
            </button>
          )}

          <div className="flex items-center space-x-3 cursor-pointer" onClick={onProfileClick}>
            <img
              className="w-12 h-12 rounded-full object-cover"
              alt={`${selectUser.firstname} ${selectUser.lastname}`}
              src={selectUser.img || selectUser.profile_avatar || 'https://via.placeholder.com/40'}
            />
            <div className={userNameText}>
              <div className="flex items-center gap-2 font-semibold">
                <span>{`${selectUser.firstname} ${selectUser.lastname}`}</span>
                {selectUser.online && (
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                )}
              </div>
              {isTyping && <span className={typingText}>typing...</span>}
            </div>
          </div>
        </div>

        <div className={`flex items-center  gap-3 md:gap-7 ml-auto ${buttonTextColor}`}>
          {/* Hide some icons on mobile for better spacing */}
          {topItems.map(({ id, icon, title }) => {
            // On mobile, show only essential icons
            if (isMobile && (title === 'Search' || title === 'Profile')) return null;

            return (
              <button
                key={id}
                title={title}
                className={`${hoverBtn} ${isMobile ? 'text-lg' : ''}cursor-pointer`}
                type="button"
                onClick={() => {
                  if (title === 'Call') {
                    setCallData(isUserSelected ? selectUser : selectGroup);
                    setShowCallModal(true);
                  } else if (title === 'Video Call') {
                    setCallData(isUserSelected ? selectUser : selectGroup);
                    setShowVideoModal(true);
                  } else if (title === 'Search') {
                    setShowSearchBox(true);
                  } else if (title === 'Profile') {
                    onProfileClick();
                  }
                }}
              >
                {icon}
              </button>
            );
          })}

          <div className="relative">
            <button
              onClick={() => setShowMoreOptions((prev) => !prev)}
              title="More"
              className={`hover:text-black dark:hover:text-white cursor-pointer ${isMobile ? 'mr-2' : 'mr-5'}`}
              type="button"
            >
              <BsThreeDots />
            </button>
            {showMoreOptions && renderMoreMenu()}
          </div>
        </div>

        {/* Audio Call Modal */}
        <div>
          {showCallModal && (
            <AudioCallModal
              user={callData}
              onCancel={() => setShowCallModal(false)}
              onCall={() => setShowCallModal(false)}
            />
          )}
        </div>

        {/* Video Call Modal */}
        <div>
          {showVideoModal && (
            <VideoCallModal
              user={callData}
              onCancel={() => setShowVideoModal(false)}
              onCall={() => setShowVideoModal(false)}
            />
          )}
        </div>

        {/* Search Box */}
        <div>
          {showSearchBox && (
            <SearchBox
              onClose={() => setShowSearchBox(false)}
              onSearch={(value) => {
                console.log('🔍 Search Payload:', value);
              }}
            />
          )}
        </div>
      </div>
    );
  }

  if (isGroupSelected) {
    return (
      <div className={commonHeaderStyle}>
        <div className="flex items-center space-x-3">
          {/* Mobile Back Button */}
          {isMobile && (
            <button
              onClick={onMobileBack}
              className="text-gray-500 dark:text-gray-300 text-xl hover:text-blue-600 dark:hover:text-blue-400 mr-2"
              title="Back"
            >
              <IoChevronBackOutline />
            </button>
          )}

          <div className="flex items-center space-x-3 cursor-pointer" onClick={onProfileClick}>
            <img
              className="w-12 h-12 rounded-full object-cover"
              alt={selectGroup.groupName}
              src={'https://via.placeholder.com/40?text=G'}
            />
            <div className={userNameText}>
              <div className="flex items-center gap-2 font-semibold">
                <span>{selectGroup.groupName}</span>
              </div>
              <span className={typingText}>
                Created by: {selectGroup.createdBy.firstname} {selectGroup.createdBy.lastname}
              </span>
            </div>
          </div>
        </div>

        <div className={`flex items-center gap-3 md:gap-7 ${buttonTextColor}`}>
          {/* Hide some icons on mobile for better spacing */}
          {topItems.map(({ id, icon, title }) => {
            // On mobile, show only essential icons
            if (isMobile && (title === 'Search' || title === 'Profile')) return null;

            return (
              <button
                key={id}
                title={title}
                className={`${hoverBtn} ${isMobile ? 'text-lg' : ''}`}
                type="button"
                onClick={() => {
                  if (title === 'Call') {
                    setCallData(isUserSelected ? selectUser : selectGroup);
                    setShowCallModal(true);
                  } else if (title === 'Video Call') {
                    setCallData(isUserSelected ? selectUser : selectGroup);
                    setShowVideoModal(true);
                  } else if (title === 'Search') {
                    setShowSearchBox(true);
                  } else if (title === 'Profile') {
                    onProfileClick();
                  }
                }}
              >
                {icon}
              </button>
            );
          })}

          <div className="relative">
            <button
              onClick={() => setShowMoreOptions((prev) => !prev)}
              title="More"
              className={`hover:text-black dark:hover:text-white cursor-pointer ${isMobile ? 'mr-2' : 'mr-5'}`}
              type="button"
            >
              <BsThreeDots />
            </button>
            {showMoreOptions && renderMoreMenu()}
          </div>
        </div>

        {/* Audio Call Modal */}
        {showCallModal && (
          <AudioCallModal
            user={callData}
            onCancel={() => setShowCallModal(false)}
            onCall={() => setShowCallModal(false)}
          />
        )}

        {/* Video Call Modal */}
        {showVideoModal && (
          <VideoCallModal
            user={callData}
            onCancel={() => setShowVideoModal(false)}
            onCall={() => setShowVideoModal(false)}
          />
        )}

        {/* Search Box */}
        {showSearchBox && (
          <SearchBox
            onClose={() => setShowSearchBox(false)}
            onSearch={(value) => {
              console.log('🔍 Search Payload:', value);
            }}
          />
        )}
      </div>
    );
  }

  return null;
}

export default Header;