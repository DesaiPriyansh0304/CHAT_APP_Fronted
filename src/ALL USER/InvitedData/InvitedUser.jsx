import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchInvitedUsers } from "../../feature/Slice/InvitedUsersSlice";

const InvitedUser = ({ onChat }) => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState('verified'); // 'verified', 'unverified', 'pending'

    useEffect(() => {
        dispatch(fetchInvitedUsers());
    }, [dispatch]);

    const invitedUsersState = useSelector((state) => state.invitedUsers);
    const users = Array.isArray(invitedUsersState?.users?.invitedUsers) ? invitedUsersState.users.invitedUsers : [];

    const filteredUsers = users.filter((invite) => {
        const matchesSearch = invite.email?.toLowerCase().includes(search.toLowerCase());

        if (!matchesSearch) return false;

        if (tab === 'verified') {
            return invite.user === null && invite.invited_is_Confirmed === true;
        } else if (tab === 'unverified') {
            return invite.user === null && invite.invited_is_Confirmed === false;
        } else if (tab === 'pending') {
            return invite.user !== null && invite.invited_is_Confirmed === false;
        }

        return false;
    });

    const getStatusLabel = (invite) => {
        if (invite.user === null && invite.invited_is_Confirmed === true) return "Verified";
        if (invite.user === null && invite.invited_is_Confirmed === false) return "Unverified";
        if (invite.user !== null && invite.invited_is_Confirmed === false) return "Pending";
        return "Unknown";
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Verified": return "text-green-600";
            case "Unverified": return "text-red-600";
            case "Pending": return "text-yellow-600";
            default: return "text-gray-600";
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#EA9282] to-[#67B7D1] bg-clip-text text-transparent">
                Invited Users
            </h2>

            {/* Search & Tabs */}
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search by email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg w-1/2 shadow-sm"
                />

                <div className="flex gap-2">
                    {['verified', 'unverified', 'pending'].map((type) => {
                        const activeGradient = {
                            verified: 'bg-gradient-to-r from-green-400 to-teal-500 text-white',
                            unverified: 'bg-gradient-to-r from-red-400 to-pink-500 text-white',
                            pending: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                        };
                        const inactive = {
                            verified: 'bg-green-100 text-green-700',
                            unverified: 'bg-red-100 text-red-700',
                            pending: 'bg-yellow-100 text-yellow-700'
                        };
                        return (
                            <motion.button
                                key={type}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setTab(type)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${tab === type ? activeGradient[type] : inactive[type]
                                    }`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full border border-gray-300 overflow-hidden rounded-lg">
                    <thead className="text-white" style={{ background: 'linear-gradient(to right, #EA9282,rgb(209, 169, 76))' }}>
                        <tr>
                            <th className="py-2 px-4 text-left">Email</th>
                            <th className="py-2 px-4 text-left">Invitation Message</th>
                            {tab === 'pending' && (
                                <>
                                    <th className="py-2 px-4 text-left">Name</th>
                                    <th className="py-2 px-4 text-left">Gender</th>
                                    <th className="py-2 px-4 text-left">Mobile</th>
                                </>
                            )}
                            <th className="py-2 px-4 text-left">Status</th>
                            <th className="py-2 px-4 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((invite, i) => {
                            const status = getStatusLabel(invite);
                            const statusColor = getStatusColor(status);
                            const user = invite.user;

                            return (
                                <motion.tr
                                    key={invite._id}
                                    className="border-t hover:bg-gradient-to-r from-gray-100 to-gray-200 transition"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <td className="py-2 px-4">{invite.email}</td>
                                    <td className="py-2 px-4 whitespace-pre-wrap">{invite.invitationMessage || '—'}</td>
                                    {tab === 'pending' && (
                                        <>
                                            <td className="py-2 px-4">{user?.firstname} {user?.lastname}</td>
                                            <td className="py-2 px-4 capitalize">{user?.gender || '—'}</td>
                                            <td className="py-2 px-4">{user?.mobile || '—'}</td>
                                        </>
                                    )}
                                    <td className={`py-2 px-4 font-medium ${statusColor}`}>
                                        {status}
                                    </td>
                                    <td className="py-2 px-4">
                                        <button
                                            onClick={() => onChat(invite)}
                                            className="text-sm bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded hover:from-blue-600 hover:to-indigo-600 transition"
                                        >
                                            Invite Again
                                        </button>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <div className="text-center text-gray-500 mt-4">
                        No {tab} invited users found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvitedUser;
