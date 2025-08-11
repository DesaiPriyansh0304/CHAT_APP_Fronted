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
            console.error('Error adding members:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Add Members</h2>
                    <FaTimes className="cursor-pointer text-gray-500 hover:text-gray-800" onClick={onClose} />
                </div>

                {filteredUsers.length === 0 ? (
                    <p className="text-gray-600">No available contacts to add.</p>
                ) : (
                    <ul className="space-y-2 max-h-64 overflow-y-auto">
                        {filteredUsers.map((user) => (
                            <li
                                key={user._id}
                                className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-gray-100"
                                onClick={() => toggleSelectUser(user._id)}
                            >
                                <div className="flex items-center space-x-3">
                                    <img src={user.profile_avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                                    <div>
                                        <p className="font-medium">
                                            {user.firstname} {user.lastname}
                                        </p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <input type="checkbox" checked={selectedUsers.includes(user._id)} readOnly />
                            </li>
                        ))}
                    </ul>
                )}

                <button
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    onClick={handleAddMembers}
                    disabled={selectedUsers.length === 0}
                >
                    Add Selected
                </button>
            </div>
        </div>
    );
};

export default AddMemberModal;