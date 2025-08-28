import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Users, Search, User, Plus, UserCheck } from 'lucide-react';
import { fetchInvitedUsers } from '../../feature/Slice/Invited-User/InvitedUsersSlice';
import { createGroup } from '../../feature/Slice/Group/CreateGroup';
import { useDebounce } from 'use-debounce';
import toast from 'react-hot-toast';

const CreateGroupModal = ({ onClose, onGroupCreated }) => {
    const dispatch = useDispatch();

    const [groupName, setGroupName] = useState('');                //Group name
    const [description, setDescription] = useState('');            //message in group create time
    const [selectedMembers, setSelectedMembers] = useState([]);    //member selected
    const [showContacts, setShowContacts] = useState(false);       //show contact user         
    const [searchTerm, setSearchTerm] = useState('');              //searchbar
    const [debouncedSearchTerm] = useDebounce(searchTerm, 400);    //debounced search

    //loginUser Slice
    const AuthUserState = useSelector((state) => state.AuthUser || {});
    const { userData: user } = AuthUserState;
    console.log('user --->/Groupadd', user);

    // Chat list slice (show in user)
    const chatList = useSelector((state) => state.chatList || {});
    const { chats: chatListData = [] } = chatList;

    // Invited users Slice (full response) - Same as Chat.jsx
    const invitedUserData = useSelector((state) => state.invitedUsers || {});
    const { invitedUsers = [], invitedBy = [], isLoaded, loading, error } = invitedUserData;

    // Group creation loading state
    const groupState = useSelector((state) => state.group || {});
    const { loading: groupLoading } = groupState;

    // Fetch invited users - same logic as Chat.jsx
    useEffect(() => {
        if (!isLoaded || debouncedSearchTerm) {
            dispatch(fetchInvitedUsers(debouncedSearchTerm));
        }
    }, [dispatch, debouncedSearchTerm, isLoaded]);

    // Same filtering logic as Chat.jsx
    const confirmedInvitedUsers = invitedUsers
        .filter((inv) => inv.invited_is_Confirmed && inv.user)
        .map((inv) => ({ ...inv.user, invited_is_Confirmed: true }));

    // Combine users - same as Chat.jsx
    const combinedChatUsers = [...confirmedInvitedUsers, ...invitedBy];

    // Get available users not in chat list - same logic as Chat.jsx
    const getAvailableUsers = () => {
        const chatListUserIds = new Set(chatListData.map((chat) => chat.userId));
        return combinedChatUsers.filter((user) => !chatListUserIds.has(user._id));
    };

    // Filter users by search - same logic as Chat.jsx
    const filterAvailableUsersBySearch = (users, searchTerm) => {
        if (!searchTerm.trim()) return users;

        return users.filter((user) => {
            const fullName = getFullName(user).toLowerCase();
            const email = user.email?.toLowerCase() || "";
            const bio = user.bio?.toLowerCase() || "";
            const search = searchTerm.toLowerCase();

            return fullName.includes(search) || email.includes(search) || bio.includes(search);
        });
    };

    // Get full name - same as Chat.jsx
    const getFullName = (user) => `${user.firstname || ""} ${user.lastname || ""}`.trim();

    // Apply search filters - same as Chat.jsx
    const filteredAvailableUsers = filterAvailableUsersBySearch(getAvailableUsers(), searchTerm);

    // Also include users from chat list for group creation
    const chatListUsers = chatListData.map(chat => ({
        _id: chat.userId,
        firstname: chat.name.split(" ")[0] || "",
        lastname: chat.name.split(" ").slice(1).join(" ") || "",
        email: chat.email,
        profile_avatar: chat.avatar,
        bio: "From recent chats"
    }));

    // Combine both recent chat users and available users
    const allAvailableUsers = [...chatListUsers, ...filteredAvailableUsers];

    // Remove duplicates based on _id and filter out current user from selection
    const uniqueUsers = allAvailableUsers.reduce((acc, current) => {
        const existing = acc.find(item => item._id === current._id);
        // Don't show current user in the selection list as they will be auto-added
        if (!existing && current._id !== user?._id) {
            acc.push(current);
        }
        return acc;
    }, []);

    // Filter unique users by search term
    const filteredUsers = filterAvailableUsersBySearch(uniqueUsers, searchTerm);

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

    const getInitials = (firstname, lastname) =>
        `${firstname?.charAt(0) || ''}${lastname?.charAt(0) || ''}`.toUpperCase();

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            toast.error('Group name is required.');
            return;
        }

        if (!user?._id) {
            toast.error('User information not found. Please login again.');
            return;
        }

        const data = {
            groupName,
            description,
            members: selectedMembers, // Current user will be automatically added in the slice
        };

        try {
            const response = await dispatch(createGroup(data)).unwrap();
            console.log('Create Group Success Response:', response);

            toast.success(response.message || 'Group created successfully! You have been added as the group admin.');
            onGroupCreated(response);

            // Reset form
            setGroupName('');
            setDescription('');
            setSelectedMembers([]);
            setShowContacts(false);
            setSearchTerm('');

            onClose();
        } catch (error) {
            console.log('Create Group Error:', error);
            toast.error(typeof err === 'string' ? error : error?.message || 'Failed to create group');
        }
    };

    // Calculate total members (selected + current user)
    const totalMembers = selectedMembers.length + 1; // +1 for current user

    return (
        <div className="fixed inset-0 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4"
            onClick={onClose}
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg shadow-2xl transform transition-all duration-300 max-h-[95vh] sm:max-h-[90vh] overflow-hidden mx-2"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 text-white p-4 sm:p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                        disabled={groupLoading}
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
                    {/* Current User Info */}
                    {user && (
                        <div className="mb-4 sm:mb-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-700 rounded-xl p-3 sm:p-4">
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
                                    <UserCheck size={16} className="text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                                        You will be added as Group Admin
                                    </p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        {user.profile_avatar ? (
                                            <img
                                                src={user.profile_avatar}
                                                alt={`${user.firstname} ${user.lastname}`}
                                                className="w-6 h-6 rounded-full object-cover border border-green-300 dark:border-green-600"
                                            />
                                        ) : (
                                            <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                                {getInitials(user.firstname, user.lastname)}
                                            </div>
                                        )}
                                        <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                                            {getFullName(user)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Group Name */}
                    <div className="mb-4 sm:mb-6">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Group Name
                        </label>
                        <input
                            type="text"
                            className="w-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-colors text-sm sm:text-base disabled:opacity-50"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Enter an awesome group name"
                            disabled={groupLoading}
                        />
                    </div>

                    {/* Group Members */}
                    <div className="mb-4 sm:mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Group Members
                            </label>
                            <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-2 py-1 rounded-full">
                                {totalMembers} member{totalMembers !== 1 ? 's' : ''} total
                            </span>
                        </div>

                        <button
                            onClick={() => setShowContacts((prev) => !prev)}
                            className="w-full bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 border-2 border-dashed border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/50 dark:hover:to-blue-900/50 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base disabled:opacity-50"
                            disabled={groupLoading}
                        >
                            <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                            <span className="font-medium">
                                {showContacts ? 'Hide Members' : 'Add Members'}
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
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none text-sm disabled:opacity-50"
                                    disabled={groupLoading}
                                />
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-3 sm:p-4 max-h-48 sm:max-h-64 overflow-y-auto custom-scrollbar">
                                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center text-sm">
                                    <User size={14} className="mr-2" />
                                    Available Users ({filteredUsers.length})
                                </p>

                                {loading ? (
                                    <div className="flex items-center justify-center py-6 sm:py-8">
                                        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-600 dark:border-purple-400"></div>
                                        <span className="ml-3 text-gray-500 dark:text-gray-400 text-sm">Loading contacts...</span>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {filteredUsers.length === 0 ? (
                                            <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">
                                                {searchTerm ? 'No contacts found matching your search' : 'No contacts available'}
                                            </p>
                                        ) : (
                                            filteredUsers.map((contact) => (
                                                <label
                                                    key={contact._id}
                                                    className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg cursor-pointer transition-all hover:bg-white dark:hover:bg-gray-600/50 ${selectedMembers.includes(contact._id)
                                                        ? 'bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-200 dark:border-purple-600'
                                                        : 'bg-transparent border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                                                        } ${groupLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedMembers.includes(contact._id)}
                                                        onChange={() => toggleMember(contact._id)}
                                                        className="w-4 h-4 text-purple-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-purple-500 dark:focus:ring-purple-400 disabled:opacity-50"
                                                        disabled={groupLoading}
                                                    />
                                                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                                                        {contact.profile_avatar ? (
                                                            <img
                                                                src={contact.profile_avatar}
                                                                alt={`${contact.firstname} ${contact.lastname}`}
                                                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 flex-shrink-0"
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0">
                                                                {getInitials(contact.firstname, contact.lastname)}
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <span className="font-medium text-gray-900 dark:text-gray-100 block truncate text-sm">
                                                                {getFullName(contact)}
                                                            </span>
                                                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 block truncate">
                                                                {contact.email}
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
                            className="w-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-colors resize-none text-sm sm:text-base disabled:opacity-50"
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What's this group about? (optional)"
                            disabled={groupLoading}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 dark:bg-gray-700/50 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 border-t border-gray-200 dark:border-gray-600">
                    <button
                        onClick={onClose}
                        disabled={groupLoading}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-500 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-400 transition-all font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateGroup}
                        disabled={!groupName.trim() || groupLoading}
                        className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-xl text-white font-medium transition-all text-sm sm:text-base flex items-center justify-center space-x-2 ${groupName.trim() && !groupLoading
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 hover:from-purple-700 hover:to-blue-700 dark:hover:from-purple-800 dark:hover:to-blue-800 shadow-lg hover:shadow-xl'
                            : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                            }`}
                    >
                        {groupLoading && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        )}
                        <span>{groupLoading ? 'Creating...' : 'Create Group'}</span>
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