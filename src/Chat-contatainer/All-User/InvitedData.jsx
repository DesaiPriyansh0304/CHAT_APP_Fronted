import React, { useState } from 'react';
import InvitedUser from '../All-User/InvitedData/InvitedUser';
import InvitedByUser from '../All-User/InvitedData/InvitedBy';

const InviteData = ({ handleChat }) => {
    const [tab, setTab] = useState('invitedUser'); //tab button

    return (
        <div className="p-2 sm:p-4">
            {/* Tab Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
                {/* Invited Users Button */}
                <div className="flex-1">
                    <button
                        onClick={() => setTab('invitedUser')}
                        style={tab === 'invitedUser' ? { backgroundColor: '#EA9282', color: '#fff' } : {}}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium shadow transition-all duration-300 text-sm sm:text-base ${tab !== 'invitedUser' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'hover:opacity-90'
                            }`}
                    >
                        Invited Users
                    </button>
                </div>

                {/* Invited By Button */}
                <div className="flex-1">
                    <button
                        onClick={() => setTab('invitedBy')}
                        style={tab === 'invitedBy' ? { backgroundColor: '#67B7D1', color: '#fff' } : {}}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium shadow transition-all duration-300 text-sm sm:text-base ${tab !== 'invitedBy' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 'hover:opacity-90'
                            }`}
                    >
                        Invited By
                    </button>
                </div>
            </div>

            {/* Conditional Rendering */}
            <div className="overflow-hidden">
                {tab === 'invitedUser' && <InvitedUser onChat={handleChat} />}
                {tab === 'invitedBy' && <InvitedByUser />}
            </div>
        </div>
    );
};

export default InviteData;