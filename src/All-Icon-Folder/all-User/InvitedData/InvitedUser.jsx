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

  // 🔍 Debugging Logs
  // console.log('📌 Current Filter (tab):', tab);
  // console.log('📦 All Users Object:', users);
  // console.log('🔎 Filtered Users for tab:', filteredUsers);
  // console.log('🚥 Loading:', loading);
  // console.log('🔁 Fetched Filters:', fetchedFilters);

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
    <div className="p-4">
      {/*tab*/}
      <div>
        <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#EA9282] to-[#67B7D1] bg-clip-text text-transparent">
          Invited Users
        </h2>
      </div>

      {/*serchbar*/}
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg w-full shadow-sm pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => dispatch(setSearchQuery(''))}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 mr-3 hover:text-red-500 text-2xl font-bold focus:outline-none"
            >
              ×
            </button>
          )}
        </div>

        <div className="flex gap-2">
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
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${tab === type ? activeGradient[type] : inactive[type]
                  }`}
              >
                {label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/*table fild*/}
      <div className="overflow-x-auto rounded-lg shadow">
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
                <td className="p-4 text-center" colSpan={7}>Loading...</td>
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
