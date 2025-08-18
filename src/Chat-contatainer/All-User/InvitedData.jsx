import React, { useState } from 'react';
import InvitedUser from '../All-User/InvitedData/InvitedUser';
import InvitedByUser from '../All-User/InvitedData/InvitedBy';

const InviteData = ({ handleChat }) => {
    const [tab, setTab] = useState('invitedUser'); // tab button

    return (
        <div className="p-2 sm:p-4">
            {/* Tab Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">

                {/* Invited Users Button */}
                <div className="flex-1">
                    <button
                        onClick={() => setTab('invitedUser')}
                        style={tab === 'invitedUser' ? { backgroundColor: '#EA9282', color: '#fff' } : {}}
                        className={`
                            w-full px-3 py-2 sm:px-4 sm:py-3 
                            rounded-lg font-medium shadow 
                            transition-all duration-300 
                            text-xs sm:text-sm md:text-base
                            touch-manipulation
                            ${tab !== 'invitedUser'
                                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                : 'hover:opacity-90'
                            }
                        `}
                    >
                        <span className="block sm:inline">Invited Users</span>
                    </button>
                </div>

                {/* Invited By Button */}
                <div className="flex-1">
                    <button
                        onClick={() => setTab('invitedBy')}
                        style={tab === 'invitedBy' ? { backgroundColor: '#67B7D1', color: '#fff' } : {}}
                        className={`
                            w-full px-3 py-2 sm:px-4 sm:py-3 
                            rounded-lg font-medium shadow 
                            transition-all duration-300 
                            text-xs sm:text-sm md:text-base
                            touch-manipulation
                            ${tab !== 'invitedBy'
                                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                : 'hover:opacity-90'
                            }
                        `}
                    >
                        <span className="block sm:inline">Invited By</span>
                    </button>
                </div>
            </div>

            {/* Conditional Rendering */}
            <div className="overflow-hidden">
                {tab === 'invitedUser' && (
                    <div className="w-full">
                        <InvitedUser onChat={handleChat} />
                    </div>
                )}
                {tab === 'invitedBy' && (
                    <div className="w-full">
                        <InvitedByUser />
                    </div>
                )}
            </div>
        </div>
    );
};

export default InviteData;