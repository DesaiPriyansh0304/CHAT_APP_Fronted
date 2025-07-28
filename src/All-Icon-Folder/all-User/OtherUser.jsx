import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useDebounce } from 'use-debounce';
import { useSelector } from 'react-redux';
import { selectOnlineUsers } from '../../feature/Slice/Socket/OnlineuserSlice';

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
    } catch (error) {
      console.error('Failed to fetch other users:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial fetch + ask for online user IDs again on refresh
  useEffect(() => {
    fetchOtherUsers();

    // 🔁 Ask server to re-emit online users
    if (window.socket) {
      window.socket.emit('getOnlineUsers');
    }
  }, []);

  // ✅ Refetch users when search changes
  useEffect(() => {
    fetchOtherUsers(debouncedSearch.trim());
  }, [debouncedSearch]);

  return (
    <div>
      {/* Header + Search */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-transparent bg-clip-text">
          Other Users
        </h2>

        <div className="relative w-full max-w-xs">
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

      {/* Users Table */}
      <div className="overflow-x-auto rounded-lg shadow">
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
              <tr>
                <td colSpan="9" className="text-center py-4">
                  Searching...
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user, i) => (
                <motion.tr
                  key={user.id}
                  className="border-t hover:bg-gradient-to-r from-green-50 to-blue-50 transitiondark:hover:bg-gradient-to-r dark:hover:from-[#86efac] dark:hover:via-[#93c5fd] dark:hover:to-[#f87171] dark:hover:text-black  duration-300"
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
