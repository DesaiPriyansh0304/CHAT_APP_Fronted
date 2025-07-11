import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvitedUsers } from "../../feature/Slice/InvitedUsersSlice";
import { FaTimes } from "react-icons/fa";

const AddMemberModal = ({ onClose, groupId, onMembersAdded }) => {
    const [users, setUsers] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const dispatch = useDispatch();
    const invitedUserState = useSelector((state) => state.invitedUsers);
    const URL = import.meta.env.VITE_REACT_APP;

    useEffect(() => {
        dispatch(fetchInvitedUsers());
    }, [dispatch]);

    useEffect(() => {
        if (invitedUserState.users && Array.isArray(invitedUserState.users)) {
            const validUsers = invitedUserState.users
                .filter((item) => item.user !== null)
                .map((item) => item.user);
            setUsers(validUsers);
        }
    }, [invitedUserState.users]);

    const toggleSelect = (userId) => {
        setSelectedIds((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleAddMembers = async () => {
        try {
            const token = localStorage.getItem("Authtoken");
            const res = await axios.post(
                `${URL}/api/msg/addmember`,
                {
                    groupId,
                    newMemberIds: selectedIds,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            onMembersAdded(res.data.group);
            onClose();
        } catch (err) {
            console.error("❌ Failed to add members:", err.message);
        }
    };

    const handleBackgroundClick = (e) => {
        if (e.target.id === 'modal-background') {
            onClose();
        }
    };

    return (
        <div
            id="modal-background"
            onClick={handleBackgroundClick}
            className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50"
        >
            <div className="bg-gradient-to-br from-white via-blue-50 to-purple-100 shadow-xl rounded-2xl w-[430px] p-6 grid gap-4 relative">
                {/* ❌ Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
                >
                    <FaTimes size={20} />
                </button>

                {/* 🔤 Title */}
                <h2 className="text-xl font-semibold text-blue-700">Add Members to Group</h2>

                {/* 📋 User List */}
                <div className="max-h-64 overflow-y-auto grid gap-2 pr-1">
                    {users.map((user) => {
                        const isSelected = selectedIds.includes(user._id);
                        return (
                            <div
                                key={user._id}
                                className={`grid grid-cols-[auto_1fr] items-center gap-3 p-2 rounded-md border cursor-pointer transition ${isSelected
                                    ? 'bg-blue-100 border-blue-400'
                                    : 'hover:bg-gray-100'
                                    }`}
                                onClick={() => toggleSelect(user._id)}
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    readOnly
                                    className="accent-blue-600 w-4 h-4 cursor-pointer"
                                />
                                <div className="text-sm text-gray-800">
                                    <div className="font-medium">
                                        {user.firstname} {user.lastname}
                                    </div>
                                    <div className="text-gray-500 text-xs">{user.email}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 🔢 Selected Count */}
                <div className="text-sm text-gray-600 text-right">
                    Selected Users: <strong>{selectedIds.length}</strong>
                </div>

                {/* 🔘 Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={onClose}
                        className="border border-gray-400 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAddMembers}
                        disabled={selectedIds.length === 0}
                        className={`py-2 rounded-md text-white font-medium ${selectedIds.length === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        Add Members
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddMemberModal;
