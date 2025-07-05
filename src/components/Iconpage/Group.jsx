import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserGroups, addGroup } from '../../feature/Slice/UserGroup';
import CreateGroupModal from '../Group/Groupadd';
import { RiGroupLine } from 'react-icons/ri';
import { FaSearch } from 'react-icons/fa';

const GroupList = ({ selectGroup, setSelectGroup }) => {
  // console.log('✌️selectGroup --->', selectGroup);
  const dispatch = useDispatch();
  const { groups, loading, error } = useSelector((state) => state.userGroups);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
          <FaSearch className="absolute top-1/2 left-3 transform-translate-y-1/2 text-gray-400" />
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
                  key={index}
                  className={`cursor-pointer px-2 py-2 rounded hover:bg-[#e3ecff] ${selectGroup?._id === group._id ? 'bg-[#d4dfff]' : ''
                    }`}
                  onClick={() => setSelectGroup(group)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 font-semibold">
                      {group.groupName.charAt(0).toUpperCase()}
                      {/* <img src="" alt="" /> */}
                    </div>
                    <span className="font-medium">#{group.groupName}</span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <CreateGroupModal
            onClose={() => setIsModalOpen(false)}
            onGroupCreated={handleGroupCreated}
          />
        )}
      </div>
    </div>
  );
};

export default GroupList;
