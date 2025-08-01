import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvitedUsers } from '../../feature/Slice/Invited-User/InvitedUsersSlice';
import { motion } from 'framer-motion';
import { useDebounce } from 'use-debounce';

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
      <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-purple-400 to-indigo-600 bg-clip-text text-transparent">
        All Live Users
      </h2>
      <p className="text-gray-600 mb-4">
        Combined list of users you invited and users who invited you.
      </p>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 px-4 py-2 border border-purple-300 rounded-md w-full max-w-md outline-none focus:ring-2 focus:ring-purple-400"
      />

      <div className="overflow-x-auto rounded-lg shadow">
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
              <tr>
                <td colSpan="8" className="text-center py-4 text-purple-500">
                  Loading...
                </td>
              </tr>
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
