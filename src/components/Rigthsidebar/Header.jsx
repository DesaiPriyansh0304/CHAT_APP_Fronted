import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { markMessagesAsRead } from '../../feature/Slice/unreadMessageSlice';
import { MdOutlineDeleteOutline, MdOutlineVolumeOff, MdOutlineInventory2 } from 'react-icons/md';
import {
  IoCallOutline,
  IoVideocamOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoChevronBackOutline
} from 'react-icons/io5';
import { BsThreeDots } from 'react-icons/bs';
//componet Use in Header
import { AudioCallModal, VideoCallModal, SearchBox } from './CallPopup';

function Header({ selectUser, isTyping, selectGroup, onProfileClick, isMobile, onMobileBack }) {

  const dispatch = useDispatch();

  const [showMoreOptions, setShowMoreOptions] = useState(false);       //menu
  const [showCallModal, setShowCallModal] = useState(false);           //audio call
  const [showVideoModal, setShowVideoModal] = useState(false);         //video call       
  const [callData, setCallData] = useState(null);
  const [showSearchBox, setShowSearchBox] = useState(false);           //search box
  const [hoveredItem, setHoveredItem] = useState(null);                //tooltip hover state

  //top icon
  const topItems = [
    { id: 1, icon: <IoSearchOutline />, title: 'Search', label: "Search Message" },
    { id: 2, icon: <IoCallOutline />, title: 'Call', label: "Audio Call" },
    { id: 3, icon: <IoVideocamOutline />, title: 'Video Call', label: "Video Call" },
    { id: 4, icon: <IoPersonOutline />, title: 'Profile', label: "Profile" },
  ];

  //menu Icon
  const dotUpsideItems = [
    { id: 101, icon: <MdOutlineInventory2 />, title: 'Archive' },
    { id: 102, icon: <MdOutlineVolumeOff />, title: 'Mute' },
    { id: 103, icon: <MdOutlineDeleteOutline />, title: 'Delete' },
  ];

  //Tooltip Component
  const Tooltip = ({ children, text, show = false }) => {
    if (!text || !show) return children;

    return (
      <div className="relative group">
        {children}
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-[9999] px-3 py-2 text-sm font-medium text-white dark:text-black bg-gray-900 dark:bg-gray-400 rounded-lg shadow-lg transition-all duration-200 opacity-100 visible whitespace-nowrap">
          {text}
          <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-gray-900 dark:bg-gray-400 rotate-45"></div>
        </div>
      </div>
    );
  };


  // Mark messages as read when user is selected(userid Privet Chate)
  useEffect(() => {
    if (selectUser && selectUser._id) {
      console.log("🔔 Marking messages as read for user:", selectUser._id);
      dispatch(markMessagesAsRead(selectUser._id));
    }
  }, [selectUser, dispatch]);

  //Clike event
  const dotmenuRef = useRef();

  //click event 
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

  const renderMoreMenu = () => (
    <div
      className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 text-sm text-gray-700 dark:text-gray-200"
      ref={dotmenuRef}
    >
      {dotUpsideItems.map(({ id, icon, title }) => (
        <button
          key={id}
          className="flex items-center justify-between w-full px-4 py-2 gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
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
      <div className='flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e]'>
        <div className="flex items-center space-x-3 flex-1 min-w-0">

          {/* Mobile Back Button */}
          <div>
            {isMobile && (
              <button
                onClick={onMobileBack}
                className="text-gray-500 dark:text-gray-300 text-xl hover:text-blue-600 dark:hover:text-blue-400 mr-3.5 cursor-pointer"
                title="Back"
              >
                <IoChevronBackOutline />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3 cursor-pointer min-w-0" onClick={onProfileClick}>
            {/* Profile image*/}
            <div className="flex-shrink-0">
              <img
                className="w-12 h-12 rounded-full object-cover"
                alt={`${selectUser.firstname || ''} ${selectUser.lastname || ''}`}
                src={selectUser.img || selectUser.profile_avatar || 'https://via.placeholder.com/40'}
              />
            </div>
            {/*User name*/}
            <div className='text-gray-900 dark:text-white min-w-0'>
              <div className="flex items-center gap-2 font-semibold">
                <span className="truncate">{`${selectUser.firstname || ''} ${selectUser.lastname || ''}`}</span>
                {selectUser.online && (
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block flex-shrink-0"></span>
                )}
              </div>
              {isTyping && <span className='text-sm text-gray-500 dark:text-gray-400'>typing...</span>}
            </div>
          </div>
        </div>

        <div className={`flex items-center gap-3 md:gap-7 text-gray-500 dark:text-gray-300 text-xl flex-shrink-0`}>
          {/* Top Icons with Tooltips */}
          {topItems.map(({ id, icon, title, label }) => {
            // On mobile, show only essential icons
            if (isMobile && (title === 'Search' || title === 'Profile')) return null;

            return (
              <Tooltip
                key={id}
                text={label}
                show={hoveredItem === `top-${id}` && !isMobile}
              >
                <button
                  title={title}
                  className={`hover:text-blue-600 dark:hover:text-blue-400 ${isMobile ? 'text-lg' : ''} cursor-pointer`}
                  type="button"
                  onMouseEnter={() => setHoveredItem(`top-${id}`)}
                  onMouseLeave={() => setHoveredItem(null)}
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
              </Tooltip>
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
      <div className='flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e]'>
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
              alt={selectGroup?.groupName || 'Group'}
              src={'https://via.placeholder.com/40?text=G'}
            />
            <div className='text-gray-900 dark:text-white'>
              <div className="flex items-center gap-2 font-semibold text-xl">
                <span>{selectGroup?.groupName || 'Unknown Group'}</span>
              </div>
              {/* FIXED: Added null checks for createdBy */}
              {/* <span className='text-sm text-gray-500 dark:text-gray-400'>
                {selectGroup?.createdBy && selectGroup.createdBy.firstname && selectGroup.createdBy.lastname
                  ? `Created by: ${selectGroup.createdBy.firstname} ${selectGroup.createdBy.lastname}`
                  : selectGroup?.createdBy?.firstname
                    ? `Created by: ${selectGroup.createdBy.firstname}`
                    : 'Group'
                }
              </span> */}
            </div>
          </div>
        </div>

        <div className={`flex items-center gap-3 md:gap-7 text-gray-500 dark:text-gray-300 text-xl`}>
          {/* Top Icons with Tooltips */}
          {topItems.map(({ id, icon, title, label }) => {
            // On mobile, show only essential icons
            if (isMobile && (title === 'Search' || title === 'Profile')) return null;

            return (
              <Tooltip
                key={id}
                text={label}
                show={hoveredItem === `top-${id}` && !isMobile}
              >
                <button
                  title={title}
                  className={`hover:text-blue-600 dark:hover:text-blue-400 ${isMobile ? 'text-lg' : ''} cursor-pointer`}
                  type="button"
                  onMouseEnter={() => setHoveredItem(`top-${id}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => {
                    if (title === 'Call') {
                      setCallData(isUserSelected ? selectUser : selectGroup);
                      setShowCallModal(true);
                    } else if (title === 'Video Call') {
                      setCallData(isUserSelected ? selectUser : selectGroup);
                      setShowVideoModal(true);
                    } else if (title === 'Profile') {
                      onProfileClick();
                    } else if (title === 'Search') {
                      setShowSearchBox(true);
                    }
                  }}
                >
                  {icon}
                </button>
              </Tooltip>
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