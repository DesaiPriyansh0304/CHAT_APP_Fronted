import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserGroups, addGroup } from '../feature/Slice/Group/UserGroup';
import { leaveGroup } from '../feature/Slice/Group/DeleteGroup';
import CreateGroupModal from '../Chat-contatainer/Group/Groupadd';
import AddMemberModal from '../Chat-contatainer/Group/AddMemberModal';
import { RiGroupLine, RiDeleteBin6Line } from 'react-icons/ri';
import { FaSearch } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { IoIosPersonAdd } from 'react-icons/io';
import { MdBlockFlipped } from 'react-icons/md';
import { DeleteGroupButton } from '../Chat-contatainer/Contacts/DeleteGroup';

const GroupList = ({ selectGroup, setSelectGroup }) => {
  const dispatch = useDispatch();
  const { groups, loading, error, hasFetched } = useSelector((state) => state.userGroups);
  const { userData } = useSelector((state) => state.loginUser);
  const loginUserId = userData?._id;

  const [isModalOpen, setIsModalOpen] = useState(false);                  //model menu(create group)
  const [searchTerm, setSearchTerm] = useState('');                       //serch group name
  const [isdotMenu, setIsdotMenu] = useState(false);                      //dot menu
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
      if (isdotMenu && dotmenuRef.current && !dotmenuRef.current.contains(event.target)) {
        setIsdotMenu(false);
        setActivegroupMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isdotMenu]);

  //fined in user role
  const getUserRoleInGroup = (group, userId) => {
    const entry = group.userIds.find((u) => u.user._id === userId);
    return entry?.role || null;
  };

  //role in show menu
  const getDotMenuByRole = (role) => {
    switch (role) {
      case 'admin':
        return [
          { id: 0, title: 'ADD Member', icon: <IoIosPersonAdd /> },
          { id: 1, title: 'Block Group', icon: <MdBlockFlipped /> },
          { id: 2, title: 'Delete Group', icon: <RiDeleteBin6Line /> },
          { id: 3, title: 'Leave Group', icon: <RiDeleteBin6Line /> },
        ];
      case 'subadmin':
        return [
          { id: 0, title: 'ADD Member', icon: <IoIosPersonAdd /> },
          { id: 1, title: 'Block Group', icon: <MdBlockFlipped /> },
          { id: 2, title: 'Leave Group', icon: <RiDeleteBin6Line /> },
        ];
      case 'member':
        return [
          { id: 1, title: 'Block Group', icon: <MdBlockFlipped /> },
          { id: 2, title: 'Leave Group', icon: <RiDeleteBin6Line /> },
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


  const filteredGroups = Array.isArray(groups)
    ? groups.filter((group) =>
      group?.groupName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  return (
    <div className="h-screen w-full">
      <div className="p-4 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-gray-800 dark:text-[var(--text-color3)] font-semibold">Groups</h2>
          <RiGroupLine
            className="text-xl text-gray-600 dark:text-[var(--text-color)] hover:text-black dark:hover:text-gray-100 cursor-pointer mr-3.5"
            onClick={() => setIsModalOpen(true)}
          />
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-blue-100 text-gray-400  border-2 border-blue-500 placeholder-gray-500 focus:outline-none"
          />
          <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500 " />
        </div>

        {/* Group List */}
        <ul className="flex flex-col gap-4 mt-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="w-5 h-5 border-3 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-blue-400">Loading groups...</span>
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredGroups.length === 0 ? (
            <p className="text-gray-500">No groups found</p>
          ) : (
            filteredGroups.map((group) => {
              const userRole = getUserRoleInGroup(group, loginUserId);
              const dotMenu = getDotMenuByRole(userRole);

              return (
                <li
                  key={group._id}
                  className={`group cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-800 px-2 py-2 rounded ${selectGroup?._id === group._id ? 'bg-[#d4dfff] dark:bg-gray-300' : ''
                    } relative`}
                  onClick={() => setSelectGroup(group)}
                >
                  <div className="flex items-center justify-between relative">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full text-purple-700 font-semibold">
                        {group.groupName.charAt(0).toUpperCase()}
                      </div>
                      <span className={`font-medium dark:text-[var(--text-color3)]  group-hover:text-white ${selectGroup?._id === group._id ? 'dark:text-gray-800' : ''} `}>
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
                          className="absolute bottom-5 right-0 w-44 bg-white dark:bg-gray-800  rounded-md shadow-md z-50"
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
                                className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer px-3 py-2 flex justify-between items-center text-sm text-gray-700 dark:text-white"
                              >
                                <span>{title}</span>
                                <span className="text-blue-500">{icon}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>

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
              groups.find((g) => g._id === targetGroupId)?.userIds.map((u) => u.user._id) || []
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
