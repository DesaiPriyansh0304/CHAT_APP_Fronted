import React, { useState } from 'react';
import toast from 'react-hot-toast';

function ContactAdd({ onClose }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const URL = import.meta.env.VITE_REACT_APP;

  const handleInvite = async () => {
    if (!email) {
      alert('Please enter an email.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('Authtoken');

      const response = await fetch(`${URL}/api/auth/invite/invitedUsers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, message }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Invitation sent successfully!');
        onClose();
      } else {
        toast.error(result.message || 'Failed to send invite.');
      }
    } catch (error) {
      console.error('Invite error:', error);
      alert('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-6 text-gray-800">Add Contact</h2>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Message */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Invitation Message (optional)
          </label>
          <textarea
            placeholder="Enter a message"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ resize: 'vertical', minHeight: '40px' }}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="text-blue-700 hover:underline">
            Close
          </button>
          <button
            onClick={handleInvite}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            {loading ? 'Sending...' : 'Invite Contact'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactAdd;
