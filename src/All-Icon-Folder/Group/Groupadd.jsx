import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Users, Search, User, Plus } from 'lucide-react';
import { fetchAllUsers } from '../../feature/Slice/FetchUserdata';
import { createGroup } from '../../feature/Slice/Group/CreateGroup';
import toast from 'react-hot-toast';

const CreateGroupModal = ({ onClose, onGroupCreated }) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const loading = useSelector((state) => state.users.loading);
  const error = useSelector((state) => state.users.error);

  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showContacts, setShowContacts] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const toggleMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter((user) =>
      `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  const getInitials = (firstname, lastname) =>
    `${firstname?.charAt(0) || ''}${lastname?.charAt(0) || ''}`.toUpperCase();

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error('Group name is required.');
      return;
    }

    const data = {
      groupName,
      description,
      members: selectedMembers,
    };

    try {
      const response = await dispatch(createGroup(data)).unwrap();
      toast.success('Group created successfully!');
      onGroupCreated(response.group); // 👈 pass group data to parent
    } catch (err) {
      console.error('Create Group Error:', err);
      toast.error(err || 'Failed to create group');
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Create New Group</h2>
              <p className="text-purple-100 text-sm">Connect with your team</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Group Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Group Name</label>
            <input
              type="text"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter an awesome group name"
            />
          </div>

          {/* Group Members */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-700">Group Members</label>
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                {selectedMembers.length} selected
              </span>
            </div>

            <button
              onClick={() => setShowContacts((prev) => !prev)}
              className="w-full bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-dashed border-purple-300 text-purple-600 px-4 py-3 rounded-xl hover:from-purple-100 hover:to-blue-100 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Plus size={18} />
              <span className="font-medium">
                {showContacts ? 'Hide Members' : 'Select Members'}
              </span>
            </button>

            {/* Contact List */}
            <div
              className={`mt-4 transition-all duration-300 ${showContacts ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}
            >
              <div className="relative mb-4">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-h-64 overflow-y-auto custom-scrollbar">
                <p className="font-semibold text-gray-700 mb-3 flex items-center">
                  <User size={16} className="mr-2" />
                  Contacts ({filteredUsers.length})
                </p>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <span className="ml-3 text-gray-500">Loading contacts...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredUsers.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No contacts found</p>
                    ) : (
                      filteredUsers.map((user) => (
                        <label
                          key={user._id}
                          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-white ${selectedMembers.includes(user._id)
                              ? 'bg-purple-50 border-2 border-purple-200'
                              : 'bg-transparent border-2 border-transparent hover:border-gray-200'
                            }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedMembers.includes(user._id)}
                            onChange={() => toggleMember(user._id)}
                            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <div className="flex items-center space-x-3 flex-1">
                            {user.profile_avatar ? (
                              <img
                                src={user.profile_avatar}
                                alt={`${user.firstname} ${user.lastname}`}
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {getInitials(user.firstname, user.lastname)}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <span className="font-medium text-gray-900 block truncate">
                                {user.firstname} {user.lastname}
                              </span>
                              <span className="text-sm text-gray-500 block truncate">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors resize-none"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this group about? (optional)"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border-2 border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            disabled={!groupName.trim()}
            className={`px-6 py-2.5 rounded-xl text-white font-medium transition-all ${groupName.trim()
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 cursor-not-allowed'
              }`}
          >
            Create Group
          </button>
        </div>
      </div>

      {/* Custom scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  );
};

export default CreateGroupModal;
