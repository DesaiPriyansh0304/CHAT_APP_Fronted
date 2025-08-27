import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useDebounce } from 'use-debounce';
import { useSelector } from 'react-redux';
import { selectOnlineUsers } from '../../feature/Slice/Socket/OnlineuserSlice';
import SkeletonLoader from "../../Public Page/SkeletonLoader";

const OtherUser = ({ onChat }) => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 500);
    const [loading, setLoading] = useState(false);

    const onlineUserIds = useSelector(selectOnlineUsers);
    const URL = import.meta.env.VITE_REACT_APP;

    const fetchOtherUsers = async (query = '') => {
        try {
            setLoading(true);
            const token = localStorage.getItem('Authtoken');

            const response = await axios.get(`${URL}/api/auth/userdata/dbuser`, {
                headers: { Authorization: `Bearer ${token}` },
                params: query ? { search: query } : {},
            });

            const formatted = response.data.data.map((user) => ({
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                gender: user.gender,
                dob: user.dob,
                mobile: user.mobile,
                bio: user.bio,
                profile_avatar: user.profile_avatar || null,
                isadmin: user.isadmin,
                is_Confirmed: user.is_Confirmed,
            }));

            setUsers(formatted);
            setLoading(false);
        } catch (error) {
            console.log('Failed to fetch other users:', error);
        }
    };

    // Desktop Table Skeleton Row Component
    const TableSkeletonRow = () => (
        <tr className="border-t hover:bg-gradient-to-r from-green-50 to-blue-50">
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
                    width={110}
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
                    width={65}
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
                    width={90}
                    height={24}
                />
            </td>
            <td className="py-2 px-4">
                <SkeletonLoader
                    width={60}
                    height={24}
                />
            </td>
            <td className="py-2 px-4">
                <SkeletonLoader
                    width={60}
                    height={28}
                    borderRadius="8px"
                />
            </td>
        </tr>
    );

    // Mobile Card Skeleton Component
    const MobileCardSkeleton = () => (
        <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
            {/* Profile Header Skeleton */}
            <div className="flex items-center space-x-3 mb-3">
                <div className="flex-shrink-0">
                    <SkeletonLoader
                        width={48}
                        height={48}
                        circle={true}
                        baseColor="#f0fdf4"
                        highlightColor="#f7fee7"
                    />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                    <SkeletonLoader
                        width="70%"
                        height={18}
                        baseColor="#f0fdf4"
                        highlightColor="#f7fee7"
                    />
                    <SkeletonLoader
                        width="85%"
                        height={14}
                        baseColor="#f0fdf4"
                        highlightColor="#f7fee7"
                    />
                    <SkeletonLoader
                        width={55}
                        height={20}
                        borderRadius="12px"
                        baseColor="#f0fdf4"
                        highlightColor="#f7fee7"
                    />
                </div>
            </div>

            {/* User Details Grid Skeleton */}
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <SkeletonLoader
                        width="50%"
                        height={12}
                        baseColor="#f0fdf4"
                        highlightColor="#f7fee7"
                    />
                    <SkeletonLoader
                        width="40%"
                        height={16}
                        baseColor="#f0fdf4"
                        highlightColor="#f7fee7"
                    />
                </div>
                <div className="space-y-1">
                    <SkeletonLoader
                        width="45%"
                        height={12}
                        baseColor="#f0fdf4"
                        highlightColor="#f7fee7"
                    />
                    <SkeletonLoader
                        width="75%"
                        height={16}
                        baseColor="#f0fdf4"
                        highlightColor="#f7fee7"
                    />
                </div>
                <div className="col-span-2 space-y-1">
                    <SkeletonLoader
                        width="60%"
                        height={12}
                        baseColor="#f0fdf4"
                        highlightColor="#f7fee7"
                    />
                    <SkeletonLoader
                        width="50%"
                        height={16}
                        baseColor="#f0fdf4"
                        highlightColor="#f7fee7"
                    />
                </div>
                <div className="col-span-2 space-y-1">
                    <SkeletonLoader
                        width="30%"
                        height={12}
                        baseColor="#f0fdf4"
                        highlightColor="#f7fee7"
                    />
                    <SkeletonLoader
                        count={2}
                        height={14}
                        baseColor="#f0fdf4"
                        highlightColor="#f7fee7"
                    />
                </div>
                <div className="col-span-2 mt-2">
                    <SkeletonLoader
                        width={70}
                        height={32}
                        borderRadius="8px"
                        baseColor="#f0fdf4"
                        highlightColor="#f7fee7"
                    />
                </div>
            </div>
        </div>
    );

    // Initial fetch + ask for online user IDs again on refresh
    useEffect(() => {
        fetchOtherUsers();

        // Ask server to re-emit online users
        if (window.socket) {
            window.socket.emit('getOnlineUsers');
        }
    }, []);

    // Refetch users when search changes
    useEffect(() => {
        fetchOtherUsers(debouncedSearch.trim());
    }, [debouncedSearch]);

    return (
        <div>
            {/* Header + Search */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-transparent bg-clip-text">
                    Other Users
                </h2>

                <div className="relative w-full sm:max-w-xs">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded w-full shadow-sm pr-10"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-500 text-2xl"
                            title="Clear"
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
                ) : users.length > 0 ? (
                    users.map((user, i) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
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
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-300 to-blue-300 text-white flex items-center justify-center font-semibold">
                                            {(user.firstname?.[0] || '') + (user.lastname?.[0] || '')}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-medium text-gray-900 truncate">
                                        {`${user.firstname || ''} ${user.lastname || ''}`}
                                    </h3>
                                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                    <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${onlineUserIds.includes(user.id)
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {onlineUserIds.includes(user.id) ? 'Online' : 'Offline'}
                                    </span>
                                </div>
                            </div>

                            {/* User Details Grid */}
                            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
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

                            {/* Chat Button */}
                            <button
                                onClick={() => onChat(user)}
                                className="w-full bg-gradient-to-r from-blue-300 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
                            >
                                Chat
                            </button>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <div className="text-gray-400 mb-2">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-500">No users found.</p>
                    </div>
                )}
            </div>

            {/* Desktop Table View (hidden on small screens) */}
            <div className="hidden sm:block overflow-x-auto rounded-lg shadow">
                <table className="min-w-full border border-gray-300 overflow-hidden rounded-lg">
                    <thead className="bg-gradient-to-r from-green-400 to-blue-400 text-white">
                        <tr>
                            <th className="py-2 px-4 text-left">Profile</th>
                            <th className="py-2 px-4 text-left">Full Name</th>
                            <th className="py-2 px-4 text-left">Email</th>
                            <th className="py-2 px-4 text-left">Gender</th>
                            <th className="py-2 px-4 text-left">DOB</th>
                            <th className="py-2 px-4 text-left">Mobile</th>
                            <th className="py-2 px-4 text-left">Bio</th>
                            <th className="py-2 px-4 text-left">Status</th>
                            <th className="py-2 px-4 text-left">Chat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            // Desktop Table Skeleton Loading
                            Array.from({ length: 6 }, (_, index) => (
                                <TableSkeletonRow key={`table-skeleton-${index}`} />
                            ))
                        ) : users.length > 0 ? (
                            users.map((user, i) => (
                                <motion.tr
                                    key={user.id}
                                    className="border-t hover:bg-gradient-to-r from-green-50 to-blue-50 transition dark:hover:bg-gradient-to-r dark:hover:from-[#86efac] dark:hover:via-[#93c5fd] dark:hover:to-[#f87171] dark:hover:text-black duration-300"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <td className="py-2 px-4">
                                        {user.profile_avatar ? (
                                            <img
                                                src={user.profile_avatar}
                                                alt="avatar"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-300 to-blue-300 text-white flex items-center justify-center font-semibold">
                                                {(user.firstname?.[0] || '') + (user.lastname?.[0] || '')}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-2 px-4">{`${user.firstname || ''} ${user.lastname || ''}`}</td>
                                    <td className="py-2 px-4">{user.email || '—'}</td>
                                    <td className="py-2 px-4 capitalize">{user.gender || '—'}</td>
                                    <td className="py-2 px-4">
                                        {user.dob ? new Date(user.dob).toLocaleDateString() : '—'}
                                    </td>
                                    <td className="py-2 px-4">{user.mobile || '—'}</td>
                                    <td className="py-2 px-4 max-w-xs truncate" title={user.bio || ''}>
                                        {user.bio || '—'}
                                    </td>
                                    <td className="py-2 px-4 text-green-700 font-medium">
                                        {onlineUserIds.includes(user.id) ? 'Online' : 'Offline'}
                                    </td>
                                    <td className="py-2 px-4">
                                        <button
                                            onClick={() => onChat(user)}
                                            className="bg-gradient-to-r from-blue-300 to-blue-600 text-white px-3 py-1 rounded-lg hover:from-blue-600 hover:to-indigo-600"
                                        >
                                            Chat
                                        </button>
                                    </td>
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center py-4 text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OtherUser;