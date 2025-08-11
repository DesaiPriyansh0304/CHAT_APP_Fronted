import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvitedUsers } from '../../../feature/Slice/Invited-User/InvitedUsersSlice';
import { useDebounce } from 'use-debounce';
import { motion } from 'framer-motion';

const InvitedByUser = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');   //searchbar
    const [debouncedSearch] = useDebounce(search, 400);

    //invited user data slice
    const { invitedBy, loading, isLoaded } = useSelector((state) => state.invitedUsers);

    {/*slice call in invited User data*/ }
    useEffect(() => {
        if (!isLoaded) {
            dispatch(fetchInvitedUsers(debouncedSearch));
        }
    }, [dispatch, debouncedSearch, isLoaded]);

    return (
        <div className="p-2 sm:p-4">
            {/*title*/}
            <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    People Who Invited You
                </h2>
            </div>

            {/*search input*/}
            <div className="mb-4 sm:mb-6">
                <div className="relative w-full sm:max-w-md">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-3 sm:px-4 py-2 border border-blue-300 rounded-md w-full outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base pr-10"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 text-xl font-bold focus:outline-none"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Card View (visible on small screens) */}
            <div className="block sm:hidden space-y-4">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <p className="mt-2 text-blue-500">Loading...</p>
                    </div>
                ) : invitedBy.length > 0 ? (
                    invitedBy.map((user, i) => (
                        <motion.div
                            key={user._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white border border-blue-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Profile Header */}
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="flex-shrink-0">
                                    {user.profile_avatar ? (
                                        <img
                                            src={user.profile_avatar}
                                            alt="avatar"
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-semibold">
                                            {(user.firstname?.[0] || '') + (user.lastname?.[0] || '')}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-medium text-gray-900 truncate">
                                        {user.firstname} {user.lastname}
                                    </h3>
                                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                    <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.is_Confirmed
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {user.is_Confirmed ? 'Online' : 'Offline'}
                                    </span>
                                </div>
                            </div>

                            {/* User Details Grid */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-gray-500 block">Gender:</span>
                                    <span className="font-medium capitalize">{user.gender || '—'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Mobile:</span>
                                    <span className="font-medium">{user.mobile || '—'}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-gray-500 block">Date of Birth:</span>
                                    <span className="font-medium">
                                        {user.dob ? new Date(user.dob).toLocaleDateString() : '—'}
                                    </span>
                                </div>
                                {user.bio && (
                                    <div className="col-span-2">
                                        <span className="text-gray-500 block">Bio:</span>
                                        <p className="font-medium text-gray-700 mt-1 leading-relaxed">
                                            {user.bio}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <div className="text-gray-400 mb-2">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-500">No one has invited you yet.</p>
                    </div>
                )}
            </div>

            {/* Desktop Table View (hidden on small screens) */}
            <div className="hidden sm:block overflow-x-auto rounded-lg shadow">
                <table className="min-w-full border border-blue-300 rounded-lg overflow-hidden">
                    <thead
                        className="text-white"
                        style={{ background: 'linear-gradient(to right, #67B7D1, #2D5D85)' }}
                    >
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
                        {loading ? (
                            <tr>
                                <td colSpan="8" className="text-center py-8">
                                    <div className="flex justify-center items-center">
                                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
                                        <span className="text-blue-500">Loading...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : invitedBy.length > 0 ? (
                            invitedBy.map((user, i) => (
                                <motion.tr
                                    key={user._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="border-t hover:bg-gradient-to-r from-blue-50 to-blue-100 dark:hover:bg-gradient-to-r dark:hover:from-[#93c5fd] dark:hover:to-[#f87171] dark:hover:text-black transition"
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
                                    <td className="py-2 px-4">
                                        {user.firstname} {user.lastname}
                                    </td>
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
                                        <span
                                            className={`font-medium ${user.is_Confirmed ? 'text-blue-700' : 'text-blue-500'}`}
                                        >
                                            {user.is_Confirmed ? 'Online' : 'Offline'}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-8">
                                    <div className="text-gray-400 mb-2">
                                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500">No one has invited you yet.</p>
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