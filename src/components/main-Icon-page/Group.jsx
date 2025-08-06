import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserGroups, addGroup } from '../../feature/Slice/Group/UserGroup';  //add member
import { deleteGroup, leaveGroup } from '../../feature/Slice/Group/DeleteGroup';  //Delete and Leave Grop 
import CreateGroupModal from '../../All-Icon-Folder/Group/Groupadd';              //create group
import AddMemberModal from '../../All-Icon-Folder/Group/AddMemberModal';
import { RiGroupLine, RiDeleteBin6Line } from 'react-icons/ri';
import { FaSearch } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { IoIosPersonAdd } from 'react-icons/io';
import { MdBlockFlipped } from 'react-icons/md';

const GroupList = ({ selectGroup, setSelectGroup }) => {

  const dispatch = useDispatch();

  const { groups, loading, error, hasFetched } = useSelector((state) => state.userGroups);
  {/*login userdata Slice*/ }
  const { userData } = useSelector((state) => state.loginUser);
  const loginUserId = userData?._id;

  const [isModalOpen, setIsModalOpen] = useState(false);                   // Create Grop modal
  const [searchTerm, setSearchTerm] = useState('');                        // Serch 
  const [isdotMenu, setIsdotMenu] = useState(false);                       // Bot menu
  const [activegroupMenuId, setActivegroupMenuId] = useState(null);        // Grop menu {id}
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);           // member model
  const [targetGroupId, setTargetGroupId] = useState(null);                // Group id pass

  {/*dot Section*/ }
  const dotmenuRef = useRef();

  //dot menu function
  const toggleMenu = (id) => {
    setIsdotMenu((prev) => !(prev && activegroupMenuId === id));
    setActivegroupMenuId(id);
  };
  //click event
  useEffect(() => {
    const handleClickAnywhere = (event) => {
      if (isdotMenu && dotmenuRef.current && !dotmenuRef.current.contains(event.target)) {
        setIsdotMenu(false);
        setActivegroupMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickAnywhere);
    return () => {
      document.removeEventListener('mousedown', handleClickAnywhere);
    };
  }, [isdotMenu]);

  {/*Grop Find in Role*/ }
  const getUserRoleInGroup = (group, userId) => {
    const entry = group.userIds.find((u) => u.user._id === userId);
    return entry?.role || null;
  };
  //role releted menu open
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

  {/*Fetch user Group Slice*/ }
  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchUserGroups());
    }
  }, [dispatch, hasFetched]);

  {/*Add group member*/ }
  const handleGroupCreated = (newGroup) => {
    dispatch(addGroup(newGroup));
    setIsModalOpen(false);
  };

  {/*Grop Name filter in user releted*/ }
  const filteredGroups = Array.isArray(groups)
    ? groups.filter(
      (group) =>
        group &&
        group.groupName &&
        group.groupName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  return (
    <>
      <div className="flex h-screen w-full">
        <div className="p-4  text-gray-800 w-full overflow-y-auto">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">

            {/*Groups tital*/}
            <div>
              <h2 className="text-2xl dark:text-[var(--text-color3)] font-semibold">Groups</h2>
            </div>
            {/*icon tital*/}
            <div>
              <RiGroupLine
                className="text-xl text-gray-600 dark:text-[var(--text-color)] hover:text-black cursor-pointer mr-3.5"
                onClick={() => setIsModalOpen(true)}
              />
            </div>
          </div>

          {/* Search Box */}
          <div className="relative mb-6">
            <div>
              <input
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md bg-[#e4e9f7] text-gray-700 placeholder-gray-500 focus:outline-none"
              />
            </div>
            <div>
              <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Group List */}
          <div className="mt-6">
            <ul className="flex flex-col gap-4">
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
                filteredGroups.map((group, index) => {
                  const userRole = getUserRoleInGroup(group, loginUserId);
                  const dotMenu = getDotMenuByRole(userRole);

                  return (
                    <li
                      key={group._id || index}
                      className={`cursor-pointer px-2 py-2 rounded  ${selectGroup?._id === group._id
                        ? 'bg-[#d4dfff] dark:text-[var(----text-color)]'
                        : ''
                        } relative`}
                      onClick={() => setSelectGroup(group)}
                    >
                      <div className="flex items-center justify-between relative">
                        {/*Grop Imge*/}
                        <div className="flex items-center space-x-3">
                          {/*Group name case*/}
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 font-semibold">
                            {group.groupName.charAt(0).toUpperCase()}
                          </div>
                          {/*Group name*/}
                          <div>
                            <span className="font-medium dark:text-[var(--text-color3)]">
                              #{group.groupName}
                            </span>
                          </div>
                        </div>

                        <div className="relative">
                          {/*Icon menu*/}
                          <div>
                            <BsThreeDots
                              className="text-lg text-gray-500 cursor-pointer dark:text-[var(--text-color)]"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMenu(group._id);
                              }}
                            />
                          </div>

                          {/* Dot Menu */}
                          <div>
                            {isdotMenu && activegroupMenuId === group._id && (
                              <div
                                ref={dotmenuRef}
                                className="absolute bottom-10 right-0 w-44 bg-white border-4 border-blue-300 rounded-md shadow-md z-50"
                              >
                                <ul>
                                  {dotMenu.map(({ title, id, icon }) => (
                                    <li
                                      key={id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsdotMenu(false);

                                        if (title === 'ADD Member') {
                                          setTargetGroupId(group._id);
                                          setIsAddMemberOpen(true);
                                        }

                                        if (title === 'Delete Group') {
                                          dispatch(deleteGroup(group._id)).then(() => {
                                            dispatch(fetchUserGroups());
                                          });
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
                                      className="hover:bg-gray-100 cursor-pointer px-3 py-2 flex justify-between items-center text-sm text-gray-700"
                                    >
                                      {/*title*/}
                                      <div>
                                        <span>{title}</span>
                                      </div>
                                      {/*icon*/}
                                      <div>
                                        <span className="text-blue-500">{icon}</span>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          {/* Create Group Modal */}
          <div>
            {isModalOpen && (
              <CreateGroupModal
                onClose={() => setIsModalOpen(false)}
                onGroupCreated={handleGroupCreated}
              />
            )}
          </div>

          {/* Add Member Modal */}
          <div>
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
        </div>
      </div>
    </>
  );
};

export default GroupList;
