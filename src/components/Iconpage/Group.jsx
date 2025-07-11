import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserGroups, addGroup } from '../../feature/Slice/UserGroup';
import CreateGroupModal from '../Group/Groupadd';
import AddMemberModal from '../Group/AddMemberModal';
import { RiGroupLine, RiDeleteBin6Line } from 'react-icons/ri';
import { FaSearch } from 'react-icons/fa';
import { BsThreeDots } from "react-icons/bs";
import { IoIosPersonAdd } from "react-icons/io";
import { MdBlockFlipped } from "react-icons/md";

const GroupList = ({ selectGroup, setSelectGroup }) => {
  const dispatch = useDispatch();
  const { groups, loading, error } = useSelector((state) => state.userGroups);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isdotMenu, setIsdotMenu] = useState(false);
  const [activegroupMenuId, setActivegroupMenuId] = useState(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [targetGroupId, setTargetGroupId] = useState(null);
  const dotmenuRef = useRef();

  const toggleMenu = (id) => {
    setIsdotMenu((prev) => !(prev && activegroupMenuId === id));
    setActivegroupMenuId(id);
  };

  const dotMenu = [
    { id: 0, title: "ADD Member", icon: <IoIosPersonAdd /> },
    { id: 1, title: "Block Group", icon: <MdBlockFlipped /> },
    { id: 2, title: "Delete Group", icon: <RiDeleteBin6Line /> },
  ];

  useEffect(() => {
    const handleClickAnywhere = (event) => {
      if (
        isdotMenu &&
        dotmenuRef.current &&
        !dotmenuRef.current.contains(event.target)
      ) {
        setIsdotMenu(false);
        setActivegroupMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickAnywhere);
    return () => {
      document.removeEventListener("mousedown", handleClickAnywhere);
    };
  }, [isdotMenu]);

  useEffect(() => {
    dispatch(fetchUserGroups());
  }, [dispatch]);

  const handleGroupCreated = (newGroup) => {
    dispatch(addGroup(newGroup));
    setIsModalOpen(false);
  };

  const filteredGroups = Array.isArray(groups)
    ? groups.filter(
      (group) =>
        group &&
        group.groupName &&
        group.groupName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  return (
    <div className="flex h-screen w-full">
      <div className="p-4 bg-[#f5f7fb] text-gray-800 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Groups</h2>
          <RiGroupLine
            className="text-xl text-gray-600 hover:text-black cursor-pointer mr-3.5"
            onClick={() => setIsModalOpen(true)}
          />
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-[#e4e9f7] text-gray-700 placeholder-gray-500 focus:outline-none"
          />
          <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Group List */}
        <div className="mt-10">
          <ul className="flex flex-col gap-4">
            {loading ? (
              <p>Loading groups...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : filteredGroups.length === 0 ? (
              <p className="text-gray-500">No groups found</p>
            ) : (
              filteredGroups.map((group, index) => (
                <li
                  key={group._id || index}
                  className={`cursor-pointer px-2 py-2 rounded hover:bg-[#e3ecff] ${selectGroup?._id === group._id ? 'bg-[#d4dfff]' : ''
                    } relative`}
                  onClick={() => setSelectGroup(group)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 font-semibold">
                        {group.groupName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">#{group.groupName}</span>
                    </div>
                    <BsThreeDots
                      className="text-lg text-gray-500 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(group._id);
                      }}
                    />
                  </div>

                  {/* Dot Menu */}
                  {isdotMenu && activegroupMenuId === group._id && (
                    <div
                      ref={dotmenuRef}
                      className="absolute right-3 mt-2 w-40 bg-white border border-blue-300 rounded-md shadow-md z-10"
                    >
                      <ul>
                        {dotMenu.map(({ title, id, icon }) => (
                          <li
                            key={id}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (title === "ADD Member") {
                                setTargetGroupId(group._id);
                                setIsAddMemberOpen(true);
                                setIsdotMenu(false);
                              }
                            }}
                            className="hover:bg-gray-100 cursor-pointer px-3 py-2 flex justify-between items-center text-sm text-gray-700"
                          >
                            <span>{title}</span>
                            <span className="text-blue-500">{icon}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Create Group Modal */}
        {isModalOpen && (
          <CreateGroupModal
            onClose={() => setIsModalOpen(false)}
            onGroupCreated={handleGroupCreated}
          />
        )}

        {/* Add Member Modal */}
        {isAddMemberOpen && (
          <AddMemberModal
            groupId={targetGroupId}
            onClose={() => {
              setIsAddMemberOpen(false);
              setTargetGroupId(null);
            }}
            onMembersAdded={() => {
              dispatch(fetchUserGroups());
            }}
          />
        )}
      </div>
    </div>
  );
};

export default GroupList;
