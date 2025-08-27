import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvitedUsers } from '../../feature/Slice/Invited-User/InvitedUsersSlice';
import { motion } from 'framer-motion';
import { useDebounce } from 'use-debounce';
import SkeletonLoader from "../../Public Page/SkeletonLoader";

const LiveChatUser = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 400);

    const { invitedUsers = [], invitedBy = [], loading } = useSelector((state) => state.invitedUsers);

    useEffect(() => {
        dispatch(fetchInvitedUsers(debouncedSearch));
    }, [dispatch, debouncedSearch]);

    const confirmedInvitedUsers = invitedUsers
        .filter((item) => item.invited_is_Confirmed && item.user !== null)
        .map((item) => item.user);

    const allLiveUsers = [...confirmedInvitedUsers, ...invitedBy];

    // Desktop Table Skeleton Row Component
    const TableSkeletonRow = () => (
        <tr className="border-t hover:bg-gradient-to-r from-purple-50 to-indigo-50">
            <td className="py-2 px-4">
                <SkeletonLoader
                    width={40}
                    height={40}
                    circle={true}
                />
            </td>
            <td className="py-2 px-4">
                <SkeletonLoader
                    width={75}
                    height={24}
                />
            </td>
            <td className="py-2 px-4">
                <SkeletonLoader
                    width={85}
                    height={24}
                />
            </td>
            <td className="py-2 px-4">
                <SkeletonLoader
                    width={55}
                    height={24}
                />
            </td>
            <td className="py-2 px-4">
                <SkeletonLoader
                    width={65}
                    height={24}
                />
            </td>
            <td className="py-2 px-4">
                <SkeletonLoader
                    width={70}
                    height={24}
                />
            </td>
            <td className="py-2 px-4">
                <SkeletonLoader
                    width={90}
                    height={24}
                />
            </td>
            <td className="py-2 px-4">
                <SkeletonLoader
                    width={50}
                    height={24}
                />
            </td>
        </tr>
    );

    // Mobile Card Skeleton Component
    const MobileCardSkeleton = () => (
        <div className="bg-white border border-purple-300 rounded-lg p-4 shadow-sm">
            {/* Profile Header Skeleton */}
            <div className="flex items-center space-x-3 mb-3">
                <div className="flex-shrink-0">
                    <SkeletonLoader
                        width={48}
                        height={48}
                        circle={true}
                    />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                    <SkeletonLoader
                        width="70%"
                        height={18}
                    />
                    <SkeletonLoader
                        width="85%"
                        height={14}
                    />
                    <SkeletonLoader
                        width={55}
                        height={20}
                        borderRadius="12px"
                    />
                </div>
            </div>

            {/* User Details Grid Skeleton */}
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <SkeletonLoader
                        width="50%"
                        height={12}
                    />
                    <SkeletonLoader
                        width="40%"
                        height={16}
                    />
                </div>
                <div className="space-y-1">
                    <SkeletonLoader
                        width="45%"
                        height={12}
                    />
                    <SkeletonLoader
                        width="75%"
                        height={16}
                    />
                </div>
                <div className="col-span-2 space-y-1">
                    <SkeletonLoader
                        width="60%"
                        height={12}
                    />
                    <SkeletonLoader
                        width="50%"
                        height={16}
                    />
                </div>
                <div className="col-span-2 space-y-1">
                    <SkeletonLoader
                        width="30%"
                        height={12}
                    />
                    <SkeletonLoader
                        count={2}
                        height={14}
                    />
                </div>
            </div>
        </div>
    );

    const renderUserRow = (user, key, index) => {
        const initials = `${user.firstname?.[0] || ''}${user.lastname?.[0] || ''}`;
        return (
            <motion.tr
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="border-t hover:bg-gradient-to-r from-purple-50 to-indigo-50 dark:hover:bg-gradient-to-r dark:hover:from-[#d8b4fe]  dark:hover:to-[#93c5fd] dark:hover:text-black transition"
            >
                <td className="py-2 px-4">
                    {user.profile_avatar ? (
                        <img
                            src={user.profile_avatar}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 text-white flex items-center justify-center font-semibold">
                            {initials || '—'}
                        </div>
                    )}
                </td>
                <td className="py-2 px-4">
                    {user.firstname} {user.lastname}
                </td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4 capitalize">{user.gender || '—'}</td>
                <td className="py-2 px-4">{user.dob ? new Date(user.dob).toLocaleDateString() : '—'}</td>
                <td className="py-2 px-4">{user.mobile || '—'}</td>
                <td className="py-2 px-4 max-w-xs truncate" title={user.bio}>
                    {user.bio || '—'}
                </td>
                <td className="py-2 px-4 text-green-600 font-medium">Online</td>
            </motion.tr>
        );
    };

    return (
        <div className="p-4">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 bg-gradient-to-r from-purple-400 to-indigo-600 bg-clip-text text-transparent">
                All Live Users
            </h2>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Combined list of users you invited and users who invited you.
            </p>

            <div className="mb-6">
                <div className="relative w-full sm:max-w-md">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-4 py-2 border border-purple-300 rounded-md w-full outline-none focus:ring-2 focus:ring-purple-400 pr-10"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-500 text-xl font-bold focus:outline-none"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Card View (visible on small screens) */}
            <div className="block sm:hidden space-y-4">
                {loading ? (
                    // Mobile Skeleton Loading
                    Array.from({ length: 4 }, (_, index) => (
                        <MobileCardSkeleton key={`mobile-skeleton-${index}`} />
                    ))
                ) : allLiveUsers.length > 0 ? (
                    allLiveUsers.map((user, i) => {
                        const initials = `${user.firstname?.[0] || ''}${user.lastname?.[0] || ''}`;
                        return (
                            <motion.div
                                key={user._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="bg-white border border-purple-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
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
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 text-white flex items-center justify-center font-semibold">
                                                {initials || '—'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-medium text-gray-900 truncate">
                                            {user.firstname} {user.lastname}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Online
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
                        );
                    })
                ) : (
                    <div className="text-center py-8">
                        <div className="text-gray-400 mb-2">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-500">No users available for live chat.</p>
                    </div>
                )}
            </div>

            {/* Desktop Table View (hidden on small screens) */}
            <div className="hidden sm:block overflow-x-auto rounded-lg shadow">
                <table className="min-w-full border border-purple-300 rounded-lg overflow-hidden">
                    <thead
                        className="text-white"
                        style={{ background: 'linear-gradient(to right, #B985F4, #6C56D2)' }}
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
                            // Desktop Table Skeleton Loading
                            Array.from({ length: 5 }, (_, index) => (
                                <TableSkeletonRow key={`table-skeleton-${index}`} />
                            ))
                        ) : allLiveUsers.length > 0 ? (
                            allLiveUsers.map((user, i) => renderUserRow(user, user._id, i))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-4 text-gray-500">
                                    No users available for live chat.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LiveChatUser;