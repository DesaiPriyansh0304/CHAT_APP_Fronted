import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useDebounce } from 'use-debounce';
import {
    fetchFilteredInvitedUsers,
    setFilter,
    setSearchQuery,
    resetFetchedFilter,
} from '../../../feature/Slice/Invited-User/FilteredInvitedUsers';
import SkeletonLoader from "../../../Public Page/SkeletonLoader";

const InvitedUser = ({ onChat }) => {
    const dispatch = useDispatch();

    {/*filter user data Slice*/ }
    const { users, currentFilter, searchQuery, loading, fetchedFilters } = useSelector(
        (state) => state.filteredInvitedUsers
    );

    const tab = currentFilter;  //tab
    const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
    const filteredUsers = users[currentFilter] || [];

    // slice api call and store data
    useEffect(() => {
        // Always fetch when search query changes or filter hasn't been fetched
        if (!fetchedFilters[tab] || debouncedSearchQuery) {
            console.log('📤 Dispatching fetch for:', tab, 'with search:', debouncedSearchQuery);
            dispatch(fetchFilteredInvitedUsers({ filter: tab, searchQuery: debouncedSearchQuery }));
        }
    }, [dispatch, tab, debouncedSearchQuery, fetchedFilters]);

    // Clear search when tab changes
    useEffect(() => {
        dispatch(setSearchQuery(''));
    }, [tab, dispatch]);

    const getStatusLabel = (invite) => {
        if (invite.user === null && invite.invited_is_Confirmed === true) return 'Verified';
        if (invite.user === null && invite.invited_is_Confirmed === false) return 'Unverified';
        if (invite.user !== null && invite.invited_is_Confirmed === false) return 'Pending';
        return 'Unknown';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Verified': return 'text-green-600';
            case 'Unverified': return 'text-red-600';
            case 'Pending': return 'text-yellow-600';
            default: return 'text-gray-600';
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'Verified': return 'bg-green-100 text-green-800';
            case 'Unverified': return 'bg-red-100 text-red-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Mobile Card Skeleton Component
    const MobileCardSkeleton = () => (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0 space-y-2">
                    <SkeletonLoader width="80%" height={16} />
                    <SkeletonLoader width="40%" height={14} />
                </div>
                <SkeletonLoader width={80} height={28} borderRadius="6px" />
            </div>
            <div className="space-y-2">
                <SkeletonLoader width="30%" height={12} />
                <SkeletonLoader count={2} height={14} />
            </div>
            {tab === 'pending' && (
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <SkeletonLoader width="50%" height={12} />
                        <SkeletonLoader width="70%" height={14} />
                    </div>
                    <div className="space-y-1">
                        <SkeletonLoader width="60%" height={12} />
                        <SkeletonLoader width="50%" height={14} />
                    </div>
                    <div className="col-span-2 space-y-1">
                        <SkeletonLoader width="40%" height={12} />
                        <SkeletonLoader width="80%" height={14} />
                    </div>
                </div>
            )}
        </div>
    );

    // Desktop Table Skeleton Row Component
    const TableSkeletonRow = () => (
        <tr className="hover:bg-gray-50">
            <td className="py-3 px-4">
                <SkeletonLoader width={80} height={30} />
            </td>
            <td className="py-3 px-4">
                <div className="space-y-1">
                    <SkeletonLoader width="90%" height={14} />
                    <SkeletonLoader width="60%" height={14} />
                </div>
            </td>
            {tab === 'pending' && (
                <>
                    <td className="py-3 px-4">
                        <SkeletonLoader width="80%" height={16} />
                    </td>
                    <td className="py-3 px-4">
                        <SkeletonLoader width="50%" height={16} />
                    </td>
                    <td className="py-3 px-4">
                        <SkeletonLoader width="70%" height={16} />
                    </td>
                </>
            )}
            <td className="py-3 px-4">
                <SkeletonLoader width={80} height={24} borderRadius="12px" />
            </td>
            <td className="py-3 px-4">
                <SkeletonLoader width={100} height={32} borderRadius="8px" />
            </td>
        </tr>
    );

    return (
        <div className="h-screen flex flex-col p-2 sm:p-4">
            {/*title*/}
            <div className="mb-3 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-[#EA9282] to-[#67B7D1] bg-clip-text text-transparent">
                    Invited Users
                </h2>
            </div>

            {/*search and filters*/}
            <div className="space-y-3 sm:space-y-4 mb-3 sm:mb-6 flex-shrink-0">
                {/* Search bar */}
                <div className="relative w-full sm:w-1/2">
                    <input
                        type="text"
                        placeholder="Search by email or name..."
                        value={searchQuery}
                        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                        className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg w-full shadow-sm pr-10 text-sm sm:text-base"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => dispatch(setSearchQuery(''))}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 mr-3 hover:text-red-500 text-xl sm:text-2xl font-bold focus:outline-none"
                        >
                            ×
                        </button>
                    )}
                </div>

                {/* Filter buttons */}
                <div className="flex flex-wrap gap-2">
                    {['verify', 'unverify', 'pending'].map((type) => {
                        const activeGradient = {
                            verify: 'bg-gradient-to-r from-green-400 to-teal-500 text-white',
                            unverify: 'bg-gradient-to-r from-red-400 to-pink-500 text-white',
                            pending: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
                        };
                        const inactive = {
                            verify: 'bg-green-100 text-green-700',
                            unverify: 'bg-red-100 text-red-700',
                            pending: 'bg-yellow-100 text-yellow-700',
                        };

                        const label =
                            type === 'verify' ? 'Verified' : type === 'unverify' ? 'Unverified' : 'Pending';

                        return (
                            <motion.button
                                key={type}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    dispatch(setFilter(type));
                                    // Reset fetched filter to ensure fresh data on tab change
                                    dispatch(resetFetchedFilter(type));
                                }}
                                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-300 text-sm sm:text-base flex-1 sm:flex-none min-w-fit ${tab === type ? activeGradient[type] : inactive[type]
                                    }`}
                            >
                                {label}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="block sm:hidden flex-1 overflow-y-auto">
                <div className="space-y-3 pb-4">
                    {loading ? (
                        // Mobile Skeleton Loading - Fixed condition
                        Array.from({ length: 5 }, (_, index) => (
                            <MobileCardSkeleton key={`mobile-skeleton-${index}`} />
                        ))
                    ) : filteredUsers.length > 0 ? (
                        filteredUsers.map((invite, i) => {
                            const status = getStatusLabel(invite);
                            const statusColor = getStatusColor(status);
                            const user = invite.user;

                            return (
                                <motion.div
                                    key={invite._id}
                                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{invite.email}</p>
                                                <p className={`text-sm font-medium ${statusColor}`}>{status}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    onChat(invite);
                                                    dispatch(resetFetchedFilter(tab));
                                                }}
                                                className="text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 py-1 rounded hover:from-blue-600 hover:to-indigo-600 transition ml-2"
                                            >
                                                Invite Again
                                            </button>
                                        </div>

                                        {invite.invitationMessage && (
                                            <div>
                                                <p className="text-xs text-gray-500">Message:</p>
                                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{invite.invitationMessage}</p>
                                            </div>
                                        )}

                                        {tab === 'pending' && user && (
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div>
                                                    <span className="text-gray-500">Name:</span>
                                                    <p className="font-medium">{user.firstname} {user.lastname}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Gender:</span>
                                                    <p className="font-medium capitalize">{user.gender || '—'}</p>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="text-gray-500">Mobile:</span>
                                                    <p className="font-medium">{user.mobile || '—'}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-3">📭</div>
                            <p>No {tab} invited users found{searchQuery && ` for "${searchQuery}"`}.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop Table View - Enhanced scrolling */}
            <div className="hidden sm:block">
                <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                    <table className="min-w-full bg-white">
                        <thead
                            className="text-white"
                            style={{ background: 'linear-gradient(to right, #EA9282,rgb(209, 169, 76))' }}
                        >
                            <tr>
                                <th className="py-3 px-4 text-left font-semibold">Email</th>
                                <th className="py-3 px-4 text-left font-semibold">Invitation Message</th>
                                {tab === 'pending' && (
                                    <>
                                        <th className="py-3 px-4 text-left font-semibold">Name</th>
                                        <th className="py-3 px-4 text-left font-semibold">Gender</th>
                                        <th className="py-3 px-4 text-left font-semibold">Mobile</th>
                                    </>
                                )}
                                <th className="py-3 px-4 text-left font-semibold">Status</th>
                                <th className="py-3 px-4 text-left font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y h-20 overflow-y-auto divide-gray-200">
                            {loading ? (
                                // Desktop Table Skeleton Loading - Fixed condition
                                Array.from({ length: 5 }, (_, index) => (
                                    <TableSkeletonRow key={`table-skeleton-${index}`} />
                                ))
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((invite, i) => {
                                    const status = getStatusLabel(invite);
                                    const statusBadge = getStatusBadgeColor(status);
                                    const user = invite.user;

                                    return (
                                        <motion.tr
                                            key={invite._id}
                                            className="hover:bg-gray-50 transition-colors"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <td className="py-3 px-4 text-sm">
                                                <div className="max-w-xs truncate">{invite.email}</div>
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                <div className="max-w-sm">
                                                    {invite.invitationMessage ? (
                                                        <div className="whitespace-pre-wrap leading-relaxed">
                                                            {invite.invitationMessage}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">—</span>
                                                    )}
                                                </div>
                                            </td>
                                            {tab === 'pending' && (
                                                <>
                                                    <td className="py-3 px-4 text-sm">
                                                        {user?.firstname} {user?.lastname}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm capitalize">
                                                        {user?.gender || '—'}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm">
                                                        {user?.mobile || '—'}
                                                    </td>
                                                </>
                                            )}
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusBadge}`}>
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() => {
                                                        onChat(invite);
                                                        dispatch(resetFetchedFilter(tab));
                                                    }}
                                                    className="text-sm bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all shadow-sm"
                                                >
                                                    Invite Again
                                                </button>
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td className="p-8 text-center text-gray-500" colSpan={7}>
                                        <div className="text-4xl mb-3">📭</div>
                                        <p>No {tab} invited users found{searchQuery && ` for "${searchQuery}"`}.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InvitedUser;