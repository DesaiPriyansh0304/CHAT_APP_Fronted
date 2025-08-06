import React, { useState } from 'react';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

function ContactAdd({ onClose }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    message: Yup.string()
      .min(5, 'Message must be at least 5 characters')
      .required('Message is required'),
  });

  const URL = import.meta.env.VITE_REACT_APP;

  const handleInvite = async () => {
    try {
      // Reset errors
      setErrors({});

      // Validate form
      await validationSchema.validate({ email, message }, { abortEarly: false });

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
        // Reset form
        setEmail('');
        setMessage('');
        onClose();
      } else {
        toast.error(result.message || 'Failed to send invite.');
      }
    } catch (err) {
      if (err.name === 'ValidationError') {
        const formErrors = {};
        err.inner.forEach((e) => {
          formErrors[e.path] = e.message;
        });
        setErrors(formErrors);
      } else {
        console.error('Invite error:', err);
        toast.error('Something went wrong!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg w-[500px] max-w-md p-6 relative mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black text-2xl cursor-pointer"
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
            className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Message */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Invitation Message
          </label>
          <textarea
            placeholder="Enter a message"
            rows={4}
            className={`w-full px-4 py-2 border ${errors.message ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ resize: 'vertical', minHeight: '40px' }}
          />
          {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
        </div>

        {/* Actions */}
        <div className="flex justify-between space-x-4">
          <button
            onClick={onClose}
            className="text-white px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-700 transition-colors cursor-pointer"
            disabled={loading}
          >
            Close
          </button>
          <button
            onClick={handleInvite}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition-colors cursor-pointer"
          >
            {loading ? 'Sending...' : 'Invite Contact'}
          </button>
        </div>
      </div>
    </>
  );
}

export default ContactAdd;