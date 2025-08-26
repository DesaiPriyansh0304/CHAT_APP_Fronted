import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserGroups, addGroup } from '../feature/Slice/Group/UserGroup';
import { leaveGroup } from '../feature/Slice/Group/DeleteGroup';
import CreateGroupModal from '../Chat-contatainer/Group/Groupadd';
import AddMemberModal from '../Chat-contatainer/Group/AddMemberModal';
import { RiGroupLine, RiDeleteBin6Line } from 'react-icons/ri';
import { BsThreeDots } from 'react-icons/bs';
import { IoIosPersonAdd } from 'react-icons/io';
import { MdBlockFlipped } from 'react-icons/md';
import { DeleteGroupButton } from '../Chat-contatainer/Contacts/DeleteGroup';
import { RxCross2 } from 'react-icons/rx';
import { CgLogOut } from "react-icons/cg";

import { RiUserSearchFill } from "react-icons/ri";
import "../Chat-contatainer/Group/css/group.css"


const GroupList = ({ selectGroup, setSelectGroup }) => {
  const dispatch = useDispatch();
  const { groups, loading, error, hasFetched } = useSelector((state) => state.userGroups);
  const { userData } = useSelector((state) => state.AuthUser);
  const AuthUserId = userData?._id;

  const [isModalOpen, setIsModalOpen] = useState(false);                  //model menu(create group)
  // console.log('isModalOpen --->Group.jsx', isModalOpen);
  const [searchTerm, setSearchTerm] = useState('');                       //serch group name
  const [isdotMenu, setIsdotMenu] = useState(false);                      //dot menu
  console.log('isdotMenu --->Group.jsx', isdotMenu);
  const [activegroupMenuId, setActivegroupMenuId] = useState(null);       // 
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);          //Add member   
  const [targetGroupId, setTargetGroupId] = useState(null);               //Grop ID
  const [deleteGroup, setDeleteGroup] = useState(false);                  //Delete Group select data
  const [deleteGroupId, setDeleteGroupId] = useState(null);               //Delete group Id    

  const dotmenuRef = useRef();

  // Toggle dot menu & reset popups
  const toggleMenu = (id) => {
    const isSameMenu = activegroupMenuId === id;

    if (isdotMenu && isSameMenu) {
      // Close menu and reset everything
      setIsdotMenu(false);
      setActivegroupMenuId(null);
      setDeleteGroup(false);
      setDeleteGroupId(null);
      setIsAddMemberOpen(false);
      setTargetGroupId(null);
    } else {
      setIsdotMenu(true);
      setActivegroupMenuId(id);
      setDeleteGroup(false);
      setDeleteGroupId(null);
      setIsAddMemberOpen(false);
      setTargetGroupId(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dotmenuRef.current && !dotmenuRef.current.contains(event.target)) {
        setIsdotMenu(false);
        setActivegroupMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //fined in user role - FIXED with proper null checks
  const getUserRoleInGroup = (group, userId) => {
    // Add null checks for group, userIds array, and userId
    if (!group || !group.userIds || !Array.isArray(group.userIds) || !userId) {
      return null;
    }

    try {
      const entry = group.userIds.find((u) => {
        // Add null checks for user object and user._id
        return u && u.user && u.user._id === userId;
      });
      return entry?.role || null;
    } catch (error) {
      console.log('Error in getUserRoleInGroup:', error);
      return null;
    }
  };

  //role in show menu
  const getDotMenuByRole = (role) => {
    switch (role) {
      case 'admin':
        return [
          { id: 0, title: 'ADD Member', icon: <IoIosPersonAdd /> },
          { id: 1, title: 'Block Group', icon: <MdBlockFlipped /> },
          { id: 2, title: 'Delete Group', icon: <RiDeleteBin6Line /> },
          { id: 3, title: 'Leave Group', icon: <CgLogOut size={16} className='font-semibold' /> },
        ];
      case 'subadmin':
        return [
          { id: 0, title: 'ADD Member', icon: <IoIosPersonAdd /> },
          { id: 1, title: 'Block Group', icon: <MdBlockFlipped /> },
          { id: 2, title: 'Leave Group', icon: <CgLogOut size={16} /> },
        ];
      case 'member':
        return [
          { id: 1, title: 'Block Group', icon: <MdBlockFlipped /> },
          { id: 2, title: 'Leave Group', icon: <CgLogOut size={16} /> },
        ];
      default:
        return [];
    }
  };

  //user wise group
  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchUserGroups());
    }
  }, [dispatch, hasFetched]);

  //Create Group
  const handleGroupCreated = (newGroup) => {
    dispatch(addGroup(newGroup));
    setIsModalOpen(false);
  };

  // IMPROVED: Added better null checks for filteredGroups
  const filteredGroups = Array.isArray(groups)
    ? groups.filter((group) => {
      // Add null check for group and groupName
      if (!group || !group.groupName) {
        return false;
      }
      return group.groupName.toLowerCase().includes(searchTerm.toLowerCase());
    })
    : [];

  return (
    <div className="h-screen w-full">
      <div className="p-4 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mx-3.5 mb-6 mt-2">
          <h2 className="libertinus-sans-regular text-[26px] text-gray-800 dark:text-[var(--text-color3)] font-semibold">Groups</h2>
          <RiGroupLine
            className="text-xl text-purple-600 dark:text-[var(--text-color)] 
                 hover:text-blue-600 dark:hover:text-gray-100 
                 cursor-pointer mr-3.5 tilt-animation"
            onClick={() => setIsModalOpen(true)}
          />
        </div>

        {/* Search bar */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search Groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg 
             bg-gradient-to-r from-purple-100 to-pink-100 
             text-gray-700 border-2 border-purple-500 
             placeholder-gray-700 focus:outline-none"
          />
          <RiUserSearchFill className="absolute top-1/2 left-3 -translate-y-1/2 text-purple-700" size={18} />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute top-1/2 right-3 text-lg font-semibold transform -translate-y-1/2 text-gray-800 hover:text-red-600 cursor-pointer"
            >
              <RxCross2 />
            </button>
          )}
        </div>

        {/* Group List */}
        <div>
          <ul className="flex flex-col gap-4 mt-6">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="w-5 h-5 border-3 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-blue-400">Loading groups...</span>
              </div>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : filteredGroups.length === 0 ? (
              <div>
                <p className="text-gray-500 text-center text-lg ">No Groups Found</p>
                {/* <p className='text-gray-600 font-semibold text-xl'>You’re not in any group. Create one to begin.</p> */}
              </div>
            ) : (
              filteredGroups.map((group) => {
                // IMPROVED: Added null check for group before processing
                if (!group || !group._id || !group.groupName) {
                  return null; // Skip invalid group objects
                }

                const userRole = getUserRoleInGroup(group, AuthUserId);
                const dotMenu = getDotMenuByRole(userRole);

                return (
                  <li
                    key={group._id}
                    className={`group cursor-pointer hover:bg-purple-100 dark:hover:bg-gray-800 px-2 py-2 rounded-md ${selectGroup?._id === group._id ? 'bg-purple-100 dark:bg-gray-300 rounded-xl' : ''
                      } relative`}
                    onClick={() => setSelectGroup(group)}
                  >
                    <div className="flex items-center justify-between relative">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 flex items-center justify-center rounded-full bg-purple-200 text-purple-700 font-semibold ${selectGroup?._id === group._id ? ' border-2 border-purple-400' : ''}`}>
                          {group.groupName.charAt(0).toUpperCase()}
                        </div>
                        <span className={`font-medium text-gray-700 ${selectGroup?._id === group._id ? 'dark:text-gray-800' : ''} `}>
                          #{group.groupName}
                        </span>
                      </div>

                      <div className="relative">
                        <BsThreeDots
                          className="text-lg text-gray-500 cursor-pointer dark:text-[var(--text-color)]"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(group._id);
                          }}
                        />

                        {isdotMenu && activegroupMenuId === group._id && (
                          <div
                            ref={dotmenuRef}
                            className="absolute bottom-5 right-0 w-35 bg-white dark:bg-gray-800 rounded-md shadow-md z-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ul>
                              {dotMenu.map(({ title, id, icon }) => (
                                <li
                                  key={id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setIsdotMenu(false);

                                    if (title === 'ADD Member') {
                                      setTargetGroupId(group._id);
                                      setIsAddMemberOpen(true);
                                    }

                                    if (title === 'Delete Group') {
                                      setDeleteGroupId(group._id);
                                      setDeleteGroup(true);
                                    }

                                    if (title === 'Leave Group') {
                                      dispatch(leaveGroup(group._id)).then(() => {
                                        dispatch(fetchUserGroups());
                                      });
                                    }

                                    if (title === 'Block Group') {
                                      console.log('Block Group not implemented yet');
                                    }
                                  }}
                                  className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer px-3 py-1.5 flex justify-between items-center text-sm text-gray-700 dark:text-white"
                                >
                                  <span>{title}</span>
                                  <span className="text-purple-500">{icon}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              }).filter(Boolean) // Remove any null entries
            )}
          </ul>
        </div>



        {/* Crete Group Modals  */}
        {isModalOpen && (
          <CreateGroupModal
            onClose={() => setIsModalOpen(false)}
            onGroupCreated={handleGroupCreated}
          />
        )}

        {/* Add member Group */}
        {isAddMemberOpen && (
          <AddMemberModal
            groupId={targetGroupId}
            onClose={() => {
              setIsAddMemberOpen(false);
              setTargetGroupId(null);
            }}
            existingMemberIds={
              // IMPROVED: Added null checks for existing member IDs
              (() => {
                const targetGroup = groups?.find((g) => g?._id === targetGroupId);
                if (!targetGroup || !targetGroup.userIds || !Array.isArray(targetGroup.userIds)) {
                  return [];
                }
                return targetGroup.userIds
                  .filter((u) => u && u.user && u.user._id) // Filter out invalid entries
                  .map((u) => u.user._id);
              })()
            }
            onMembersAdded={() => {
              dispatch(fetchUserGroups());
            }}
          />
        )}
      </div>

      {/* Delete Group */}
      {deleteGroup && (
        <DeleteGroupButton
          groupId={deleteGroupId}
          onClose={() => {
            setDeleteGroup(false);
            setDeleteGroupId(null);
            dispatch(fetchUserGroups());
          }}
        />
      )}
    </div>
  );
};

export default GroupList;