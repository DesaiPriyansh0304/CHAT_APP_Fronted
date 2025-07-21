import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { IoCall, IoVideocamOutline } from 'react-icons/io5';
import { MdClose } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '../../feature/Slice/Chat/ChatHistory';

const getFullName = (user) => `${user?.firstname || ''} ${user?.lastname || ''}`.trim();

export const AudioCallModal = ({ user, onCancel, onCall }) => {
  return (
    <div
      className="fixed inset-0  bg-opacity-40 flex justify-center items-center z-50"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#2e2e2e] rounded-2xl shadow-xl w-[500px] h-[300px] text-center p-6 transition-colors duration-300"
      >
        <div className="flex justify-center mb-4">
          <img
            src={user?.profile_avatar || 'https://via.placeholder.com/100'}
            alt={getFullName(user)}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
          />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{getFullName(user)}</h2>
        <p className="text-gray-500 dark:text-gray-300 mt-1">Start Audio Call</p>

        <div className="flex justify-center gap-10 mt-6">
          <button
            onClick={onCancel}
            className="bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl hover:bg-red-600"
          >
            <MdClose />
          </button>
          <button
            onClick={onCall}
            className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl hover:bg-green-600"
          >
            <IoCall />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const VideoCallModal = ({ user, onCancel, onCall }) => {
  return (
    <div
      className="fixed inset-0  bg-opacity-40 flex justify-center items-center z-50"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#2e2e2e] rounded-2xl shadow-xl w-[500px] h-[300px] text-center p-6 transition-colors duration-300"
      >
        <div className="flex justify-center mb-4">
          <img
            src={user?.profile_avatar || 'https://via.placeholder.com/100'}
            alt={getFullName(user)}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
          />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{getFullName(user)}</h2>
        <p className="text-gray-500 dark:text-gray-300 mt-1">Start Video Call</p>

        <div className="flex justify-center gap-10 mt-6">
          <button
            onClick={onCancel}
            className="bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl hover:bg-red-600"
          >
            <MdClose />
          </button>
          <button
            onClick={onCall}
            className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl hover:bg-green-600"
          >
            <IoVideocamOutline />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const SearchBox = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const boxRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = query.trim();
      if (trimmed) {
        dispatch(setSearchQuery(trimmed));
        onClose();
      }
    }
  };

  return (
    <div className="absolute top-16 right-50 z-50" ref={boxRef}>
      <div className="w-64 bg-white dark:bg-[#2e2e2e] rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 transition-colors duration-300">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-2 px-4 bg-blue-50 dark:bg-[#1f1f1f] text-black dark:text-white rounded-xl outline-none"
        />
      </div>
    </div>
  );
};
