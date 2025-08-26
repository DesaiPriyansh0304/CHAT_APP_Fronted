import React, { useState } from 'react';
import { motion } from 'framer-motion';
import InvitedData from '../Chat-contatainer/All-User/InvitedData';
import OtherUser from '../Chat-contatainer/All-User/OtherUser';
import LiveChatUser from '../Chat-contatainer/All-User/LivechatUser';
import { useSelector } from 'react-redux';

function AllUser() {
  const [activeTab, setActiveTab] = useState('invited'); // Active Tab
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Selected user data

  // Login User Data Slice
  const AuthUserState = useSelector((state) => state.AuthUser || {});
  const user = AuthUserState?.userData;
  // console.log('user --->All User', user);

  // Function
  const handleChat = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-yellow-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      {/* Title */}
      <div className="border-2 border-amber-900 rounded-2xl h-20 w-full mb-6 shadow-md flex items-center justify-center text-xl font-semibold text-amber-900 dark:text-amber-200 dark:border-amber-400">
        All Users Panel
      </div>

      {/* Tabs */}
      <div className={`grid ${user?.isAdmin ? 'grid-cols-3' : 'grid-cols-2'} gap-5 mb-6`}>
        {/* If user isAdmin = true => Show all 3 tabs */}
        {user?.isAdmin ? (
          <>
            {/* Invited Data */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('invited')}
              className={`py-2 rounded-xl font-medium text-lg shadow-sm transition-all duration-300
                ${activeTab === 'invited'
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                }`}
            >
              Invited Data
            </motion.button>

            {/* Other Users */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('other')}
              className={`py-2 rounded-xl font-medium text-lg shadow-sm transition-all duration-300
                ${activeTab === 'other'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                }`}
            >
              Other Users
            </motion.button>

            {/* Live Chat */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('livechat')}
              className={`py-2 rounded-xl font-medium text-lg shadow-sm transition-all duration-300
                ${activeTab === 'livechat'
                  ? 'bg-purple-500 text-white'
                  : 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
                }`}
            >
              Live Chat
            </motion.button>
          </>
        ) : (
          // If not Admin => Show only Invited Data & Live Chat
          <>
            {/* Invited Data */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('invited')}
              className={`py-2 rounded-xl font-medium text-lg shadow-sm transition-all duration-300
                ${activeTab === 'invited'
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                }`}
            >
              Invited Data
            </motion.button>

            {/* Live Chat */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('livechat')}
              className={`py-2 rounded-xl font-medium text-lg shadow-sm transition-all duration-300
                ${activeTab === 'livechat'
                  ? 'bg-purple-500 text-white'
                  : 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
                }`}
            >
              Live Chat
            </motion.button>
          </>
        )}
      </div>

      {/* Content Area */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-800 dark:text-white rounded-2xl p-6 shadow-md min-h-[300px]"
      >
        {activeTab === 'invited' && <InvitedData handleChat={handleChat} />}
        {activeTab === 'other' && user?.isAdmin && <OtherUser onChat={handleChat} />}
        {activeTab === 'livechat' && <LiveChatUser onChat={handleChat} />}
      </motion.div>

      {/* Chat Invite Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-40 dark:bg-opacity-60">
          <div className="bg-gradient-to-b from-blue-200 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Start Chat</h3>

            <label className="block mb-2 font-medium text-sm dark:text-gray-200">Email</label>
            <input
              type="email"
              value={selectedUser?.email}
              readOnly
              className="w-full mb-4 px-4 py-2 border rounded-lg bg-gray-50 text-gray-700 dark:bg-gray-600 dark:text-white dark:border-gray-500"
            />

            <label className="block mb-2 font-medium text-sm dark:text-gray-200">Message</label>
            <textarea
              rows="4"
              placeholder="Type your message..."
              className="w-full px-4 py-2 border rounded-lg mb-4 dark:bg-gray-600 dark:text-white dark:border-gray-500"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Chat invitation sent!');
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Chat Invite
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllUser;
