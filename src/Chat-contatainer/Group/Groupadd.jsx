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
            console.log('Create Group Success Response:', response);

            // Response થી message લઈએ
            toast.success(response.message || 'Group created successfully!');

            // Parent component ને group data pass કરીએ
            onGroupCreated(response);

            // Form reset કરીએ
            setGroupName('');
            setDescription('');
            setSelectedMembers([]);
            setShowContacts(false);
            setSearchTerm('');

            // Modal close કરીએ
            onClose();
        } catch (err) {
            console.error('Create Group Error:', err);
            toast.error(typeof err === 'string' ? err : err?.message || 'Failed to create group');
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg shadow-2xl transform transition-all duration-300 max-h-[95vh] sm:max-h-[90vh] overflow-hidden mx-2">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 text-white p-4 sm:p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                    >
                        <X size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    <div className="flex items-center space-x-3 pr-10">
                        <div className="bg-white bg-opacity-20 p-2 sm:p-3 rounded-full">
                            <Users size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-2xl font-bold">Create New Group</h2>
                            <p className="text-purple-100 text-xs sm:text-sm">Connect with your team</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-120px)]">
                    {/* Group Name */}
                    <div className="mb-4 sm:mb-6">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Group Name
                        </label>
                        <input
                            type="text"
                            className="w-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-colors text-sm sm:text-base"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Enter an awesome group name"
                        />
                    </div>

                    {/* Group Members */}
                    <div className="mb-4 sm:mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Group Members
                            </label>
                            <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-2 py-1 rounded-full">
                                {selectedMembers.length} selected
                            </span>
                        </div>

                        <button
                            onClick={() => setShowContacts((prev) => !prev)}
                            className="w-full bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 border-2 border-dashed border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/50 dark:hover:to-blue-900/50 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                        >
                            <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                            <span className="font-medium">
                                {showContacts ? 'Hide Members' : 'Select Members'}
                            </span>
                        </button>

                        {/* Contact List */}
                        <div
                            className={`mt-4 transition-all duration-300 ${showContacts ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'
                                }`}
                        >
                            <div className="relative mb-4">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                    size={16}
                                />
                                <input
                                    type="text"
                                    placeholder="Search contacts..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none text-sm"
                                />
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-3 sm:p-4 max-h-48 sm:max-h-64 overflow-y-auto custom-scrollbar">
                                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center text-sm">
                                    <User size={14} className="mr-2" />
                                    Contacts ({filteredUsers.length})
                                </p>

                                {loading ? (
                                    <div className="flex items-center justify-center py-6 sm:py-8">
                                        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-600 dark:border-purple-400"></div>
                                        <span className="ml-3 text-gray-500 dark:text-gray-400 text-sm">Loading contacts...</span>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {filteredUsers.length === 0 ? (
                                            <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">No contacts found</p>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <label
                                                    key={user._id}
                                                    className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg cursor-pointer transition-all hover:bg-white dark:hover:bg-gray-600/50 ${selectedMembers.includes(user._id)
                                                        ? 'bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-200 dark:border-purple-600'
                                                        : 'bg-transparent border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedMembers.includes(user._id)}
                                                        onChange={() => toggleMember(user._id)}
                                                        className="w-4 h-4 text-purple-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-purple-500 dark:focus:ring-purple-400"
                                                    />
                                                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                                                        {user.profile_avatar ? (
                                                            <img
                                                                src={user.profile_avatar}
                                                                alt={`${user.firstname} ${user.lastname}`}
                                                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 flex-shrink-0"
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0">
                                                                {getInitials(user.firstname, user.lastname)}
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <span className="font-medium text-gray-900 dark:text-gray-100 block truncate text-sm">
                                                                {user.firstname} {user.lastname}
                                                            </span>
                                                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 block truncate">
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
                    <div className="mb-4 sm:mb-6">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            className="w-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-colors resize-none text-sm sm:text-base"
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What's this group about? (optional)"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 dark:bg-gray-700/50 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 border-t border-gray-200 dark:border-gray-600">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-500 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-400 transition-all font-medium text-sm sm:text-base"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateGroup}
                        disabled={!groupName.trim()}
                        className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-xl text-white font-medium transition-all text-sm sm:text-base ${groupName.trim()
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 hover:from-purple-700 hover:to-blue-700 dark:hover:from-purple-800 dark:hover:to-blue-800 shadow-lg hover:shadow-xl'
                            : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
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
                }
                .dark .custom-scrollbar::-webkit-scrollbar-track {
                    background: #374151;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 3px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #6b7280;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #a1a1a1;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }
            `}</style>
        </div>
    );
};

export default CreateGroupModal;