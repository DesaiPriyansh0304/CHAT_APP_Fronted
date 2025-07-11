import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { IoCall, IoVideocamOutline } from 'react-icons/io5';
import { MdClose } from 'react-icons/md';

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
                className="bg-white rounded-2xl shadow-xl w-[500px] h-[300px] text-center p-6"
            >
                <div className="flex justify-center mb-4">
                    <img
                        src={user?.profile_avatar || 'https://via.placeholder.com/100'}
                        alt={getFullName(user)}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
                    />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{getFullName(user)}</h2>
                <p className="text-gray-500 mt-1">Start Audio Call</p>

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
        <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50"
            onClick={onCancel}>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl w-[500px] h-[300px] text-center p-6"
            >
                <div className="flex justify-center mb-4">
                    <img
                        src={user?.profile_avatar || 'https://via.placeholder.com/100'}
                        alt={getFullName(user)}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
                    />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{getFullName(user)}</h2>
                <p className="text-gray-500 mt-1">Start Video Call</p>

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

export const SearchBox = ({ onClose, onSearch }) => {

    const [query, setQuery] = useState('');
    const boxRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (boxRef.current && !boxRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (query.trim()) {
                onSearch(query.trim());
                onClose(); // Close after search
            }
        }
    };
    return (
        <div className="absolute top-16 right-50 z-50" ref={boxRef} >
            <div className="w-64 bg-white rounded-xl shadow-xl border border-gray-200">
                <input
                    type="text"
                    placeholder="Search.."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full p-2 px-4 bg-blue-50 rounded-xl outline-none"
                />
            </div>
        </div>
    );
};
