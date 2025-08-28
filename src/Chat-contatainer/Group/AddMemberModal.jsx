import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchInvitedUsers } from '../../feature/Slice/Invited-User/InvitedUsersSlice';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

const AddMemberModal = ({ groupId, onClose, onMembersAdded, existingMemberIds }) => {
    const dispatch = useDispatch();
    const { invitedUsers, invitedBy } = useSelector((state) => state.invitedUsers);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchInvitedUsers());
    }, [dispatch]);

    useEffect(() => {
        // Flatten and filter out users already in group
        const allUsers = [];

        invitedUsers?.forEach((inv) => {
            if (inv.user && !existingMemberIds.includes(inv.user._id)) {
                allUsers.push(inv.user);
            }
        });

        invitedBy?.forEach((user) => {
            if (user && !existingMemberIds.includes(user._id)) {
                allUsers.push(user);
            }
        });

        setFilteredUsers(allUsers);
    }, [invitedUsers, invitedBy, existingMemberIds]);

    const toggleSelectUser = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const URL = import.meta.env.VITE_REACT_APP;

    const handleAddMembers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('Authtoken');

            const response = await axios.post(
                `${URL}/api/msg/addmember`,
                {
                    groupId,
                    newMemberIds: selectedUsers,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.message === 'Members added') {
                onMembersAdded();
                onClose();
            }
        } catch (error) {
            console.log('Error adding members:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle outside click to close modal
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50  dark:bg-opacity-70 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col transition-colors duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Add Members
                    </h2>
                    <button
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <FaTimes className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden p-4 sm:p-6">
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                                No available contacts to add.
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Select members to add to the group ({selectedUsers.length} selected)
                            </p>
                            <div className="max-h-64 sm:max-h-80 overflow-y-auto">
                                <ul className="space-y-2">
                                    {filteredUsers.map((user) => (
                                        <li
                                            key={user._id}
                                            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${selectedUsers.includes(user._id)
                                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                                                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                }`}
                                            onClick={() => toggleSelectUser(user._id)}
                                        >
                                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                <img
                                                    src={user.profile_avatar}
                                                    alt="avatar"
                                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                                                    onError={(e) => {
                                                        e.target.src = '/default-avatar.png'; // Fallback image
                                                    }}
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm sm:text-base">
                                                        {user.firstname} {user.lastname}
                                                    </p>
                                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user._id)}
                                                readOnly
                                                className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 flex-shrink-0"
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            className="order-2 sm:order-1 flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm sm:text-base"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            className="order-1 sm:order-2 flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed text-sm sm:text-base font-medium"
                            onClick={handleAddMembers}
                            disabled={selectedUsers.length === 0 || loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Adding...
                                </div>
                            ) : (
                                `Add Member`
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddMemberModal;