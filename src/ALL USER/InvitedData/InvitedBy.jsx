import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvitedUsers } from '../../feature/Slice/InvitedUsersSlice';
import { motion } from 'framer-motion';

const InvitedByUser = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchInvitedUsers());
    }, [dispatch]);

    const invitedUsersState = useSelector((state) => state.invitedUsers);
    const invitedBy = invitedUsersState?.users?.invitedBy || [];

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                People Who Invited You
            </h2>

            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full border border-blue-300 rounded-lg overflow-hidden">
                    <thead className="text-white" style={{ background: 'linear-gradient(to right, #67B7D1, #2D5D85)' }}>
                        <tr>
                            <th className="py-2 px-4 text-left">Profile</th>
                            <th className="py-2 px-4 text-left">Full Name</th>
                            <th className="py-2 px-4 text-left">Email</th>
                            <th className="py-2 px-4 text-left">Gender</th>
                            <th className="py-2 px-4 text-left">Date of Birth</th>
                            <th className="py-2 px-4 text-left">Mobile</th>
                            <th className="py-2 px-4 text-left">Bio</th>
                            <th className="py-2 px-4 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invitedBy.length > 0 ? (
                            invitedBy.map((user, i) => (
                                <motion.tr
                                    key={user._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="border-t hover:bg-gradient-to-r from-blue-50 to-blue-100 transition"
                                >
                                    <td className="py-2 px-4">
                                        {user.profile_avatar ? (
                                            <img
                                                src={user.profile_avatar}
                                                alt="avatar"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-semibold">
                                                {(user.firstname?.[0] || '') + (user.lastname?.[0] || '')}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-2 px-4">{user.firstname} {user.lastname}</td>
                                    <td className="py-2 px-4">{user.email}</td>
                                    <td className="py-2 px-4 capitalize">{user.gender}</td>
                                    <td className="py-2 px-4">
                                        {user.dob ? new Date(user.dob).toLocaleDateString() : '—'}
                                    </td>
                                    <td className="py-2 px-4">{user.mobile}</td>
                                    <td className="py-2 px-4 max-w-xs truncate" title={user.bio}>
                                        {user.bio || '—'}
                                    </td>
                                    <td className="py-2 px-4">
                                        <span className={`font-medium ${user.is_Confirmed ? 'text-blue-700' : 'text-blue-500'}`}>
                                            {user.is_Confirmed ? 'Online' : 'Offline'}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-4 text-gray-500">
                                    No one has invited you yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvitedByUser;
