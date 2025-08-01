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
    if (!fetchedFilters[tab]) {
      console.log('📤 Dispatching fetch for:', tab, 'with search:', debouncedSearchQuery);
      dispatch(fetchFilteredInvitedUsers({ filter: tab, searchQuery: debouncedSearchQuery }));
    }
  }, [dispatch, tab, debouncedSearchQuery, fetchedFilters]);

  // Clear search when tab changes
  useEffect(() => {
    dispatch(setSearchQuery(''));
  }, [tab]);

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

  return (
    <div className="p-2 sm:p-4">
      {/*title*/}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-[#EA9282] to-[#67B7D1] bg-clip-text text-transparent">
          Invited Users
        </h2>
      </div>

      {/*search and filters*/}
      <div className="space-y-4 mb-4 sm:mb-6">
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
                  if (!fetchedFilters[type]) {
                    dispatch(fetchFilteredInvitedUsers({ filter: type, searchQuery: debouncedSearchQuery }));
                  }
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

      {/* Mobile Card View (visible on small screens) */}
      <div className="block sm:hidden space-y-3">
        {!loading && filteredUsers.length > 0 ? (
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
        ) : loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500">Loading...</p>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No {tab} invited users found.
          </div>
        )}
      </div>

      {/* Desktop Table View (hidden on small screens) */}
      <div className="hidden sm:block overflow-x-auto rounded-lg shadow">
        <table className="min-w-full border border-gray-300 overflow-hidden rounded-lg">
          <thead
            className="text-white"
            style={{ background: 'linear-gradient(to right, #EA9282,rgb(209, 169, 76))' }}
          >
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
            {!loading && filteredUsers.length > 0 ? (
              filteredUsers.map((invite, i) => {
                const status = getStatusLabel(invite);
                const statusColor = getStatusColor(status);
                const user = invite.user;

                return (
                  <motion.tr
                    key={invite._id}
                    className="border-t hover:bg-gradient-to-r from-gray-100 to-gray-300 transition"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <td className="py-2 px-4">{invite.email}</td>
                    <td className="py-2 px-4 whitespace-pre-wrap">
                      {invite.invitationMessage || '—'}
                    </td>
                    {tab === 'pending' && (
                      <>
                        <td className="py-2 px-4">{user?.firstname} {user?.lastname}</td>
                        <td className="py-2 px-4 capitalize">{user?.gender || '—'}</td>
                        <td className="py-2 px-4">{user?.mobile || '—'}</td>
                      </>
                    )}
                    <td className={`py-2 px-4 font-medium ${statusColor}`}>{status}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => {
                          onChat(invite);
                          dispatch(resetFetchedFilter(tab));
                        }}
                        className="text-sm bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded hover:from-blue-600 hover:to-indigo-600 transition"
                      >
                        Invite Again
                      </button>
                    </td>
                  </motion.tr>
                );
              })
            ) : loading ? (
              <tr>
                <td className="p-4 text-center" colSpan={7}>
                  <div className="flex justify-center items-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
                    Loading...
                  </div>
                </td>
              </tr>
            ) : (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={7}>
                  No {tab} invited users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvitedUser;