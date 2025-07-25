import React, { useState } from 'react';
import InvitedUser from '../all-User/InvitedData/InvitedUser';
import InvitedByUser from '../all-User/InvitedData/InvitedBy';

const InviteData = ({ handleChat }) => {
  const [tab, setTab] = useState('invitedUser'); //tab button

  return (
    <div className="p-4">
      {/* Tab Buttons */}
      <div className="flex gap-4 mb-6">
        {/*  Invited UsersButtons */}
        <div>
          <button
            onClick={() => setTab('invitedUser')}
            style={tab === 'invitedUser' ? { backgroundColor: '#EA9282', color: '#fff' } : {}}
            className={`px-4 py-2 rounded-lg font-medium shadow transition-all duration-300 ${tab !== 'invitedUser' ? 'bg-red-100 text-red-800' : ''}`}
          >
            Invited Users
          </button>
        </div>
        {/* Invited By Buttons */}
        <div>
          <button
            onClick={() => setTab('invitedBy')}
            style={tab === 'invitedBy' ? { backgroundColor: '#67B7D1', color: '#fff' } : {}}
            className={`px-4 py-2 rounded-lg font-medium shadow transition-all duration-300 ${tab !== 'invitedBy' ? 'bg-blue-100 text-blue-800' : ''}`}
          >
            Invited By
          </button>
        </div>
      </div>

      {/* Conditional Rendering */}
      {tab === 'invitedUser' && <InvitedUser onChat={handleChat} />}
      {tab === 'invitedBy' && <InvitedByUser />}
    </div>
  );
};

export default InviteData;
