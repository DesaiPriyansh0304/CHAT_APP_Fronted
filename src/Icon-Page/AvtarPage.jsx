import React, { useEffect, useRef, useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { RxCross2 } from "react-icons/rx";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // For React Router v6
// Alternative imports for different routing systems:
// import { useHistory } from 'react-router-dom'; // For React Router v5
// import { useRouter } from 'next/router'; // For Next.js
import moment from 'moment';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import axios from 'axios';
import { setUserData } from '../feature/Auth/LoginUserSlice';

function AvtarPage() {
  const user = useSelector((state) => state.AuthUser.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // For React Router v6
  // Alternative for different routing systems:
  // const history = useHistory(); // For React Router v5
  // const router = useRouter(); // For Next.js

  const [avatrFrom, setAvtarFrom] = useState({
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    dob: '',
    gender: '',
    bio: '',
    profile_avatar: null,
  });

  const [initialFormData, setInitialFormData] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formChanged, setFormChanged] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      const formatted = {
        email: user.email || '',
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        mobile: user.mobile || '',
        gender: user.gender || '',
        dob: user.dob ? moment(user.dob).format('YYYY-MM-DD') : '',
        bio: user.bio || '',
        profile_avatar: user.profile_avatar || null,
      };
      setAvtarFrom(formatted);
      setInitialFormData(formatted);
      if (formatted.profile_avatar) {
        setPreview(formatted.profile_avatar);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newForm = { ...avatrFrom, [name]: value };
    setAvtarFrom(newForm);
    setFormChanged(JSON.stringify(newForm) !== JSON.stringify(initialFormData));
  };

  const handleImageClick = () => fileInputRef.current.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvtarFrom((prev) => ({ ...prev, profile_avatar: file }));
      setPreview(URL.createObjectURL(file));
      setFormChanged(true);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let avatarBase64 = avatrFrom.profile_avatar;
      if (avatarBase64 && typeof avatarBase64 !== 'string') {
        avatarBase64 = await toBase64(avatarBase64);
      }

      const token = localStorage.getItem('Authtoken');
      const response = await axios.put(
        `${import.meta.env.VITE_REACT_APP}/api/auth/update-profile`,
        { ...avatrFrom, profile_avatar: avatarBase64 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201 || response.data.success) {
        toast.success('Profile updated successfully!');

        // Update userData in redux
        dispatch(setUserData(response.data.user));
        setEditMode(false);
        setFormChanged(false);
        setInitialFormData({ ...avatrFrom, profile_avatar: avatarBase64 });
      } else {
        toast.error('Profile update failed');
      }
    } catch (error) {
      console.log('Update Error:', error);
      toast.error('Something went wrong.');
    }
  };

  const handleCancel = () => {
    setAvtarFrom(initialFormData);
    setPreview(initialFormData?.profile_avatar || null);
    setFormChanged(false);
    setEditMode(false);
  };

  const handleGoBack = () => {
    navigate(-1); // For React Router v6 - goes back to previous page
    // Alternative for different routing systems:
    // history.goBack(); // For React Router v5
    // router.back(); // For Next.js
  };

  if (!user) {
    return (
      <div className="text-center mt-10 text-gray-700 dark:text-white">Loading profile...</div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10 bg-gradient-to-br from-purple-50 via-fuchsia-100 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-3xl bg-white text-gray-800 dark:bg-[#1e1e1e] dark:text-white rounded-lg border border-purple-400 shadow-lg overflow-hidden"
      >
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="absolute top-4 left-4 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md shadow-md dark:bg-[#3b9fc1] dark:hover:bg-[#2f91b2] cursor-pointer z-10"
          >
            <MdEdit className="text-lg" />
            Edit Profile
          </button>
        )}

        {/* Go back button */}
        <button
          onClick={handleGoBack}
          className="absolute top-4 right-4 hover:text-red-600 text-gray-600 cursor-pointer z-10"
        >
          <RxCross2 className="text-xl" />
        </button>

        <div className="flex flex-col items-center px-6 py-8 max-h-[90vh] overflow-hidden">
          <div className="relative mb-6">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-purple-400 shadow dark:border-[#3b9fc1]">
              {preview ? (
                <img src={preview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  No Image
                </div>
              )}
            </div>
            {editMode && (
              <>
                <button
                  onClick={handleImageClick}
                  className="absolute bottom-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow"
                >
                  <MdEdit className="text-xl text-[#EA9282] dark:text-[#f28b7e]" />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </>
            )}
          </div>

          <div className="w-full overflow-y-auto pr-1">
            <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'First Name', name: 'firstname' },
                { label: 'Last Name', name: 'lastname' },
                { label: 'Email', name: 'email', type: 'email', alwaysDisabled: true },
                { label: 'Mobile', name: 'mobile' },
                { label: 'Date of Birth', name: 'dob', type: 'date' },
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {field.label}
                  </label>
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    value={avatrFrom[field.name]}
                    onChange={handleChange}
                    disabled={field.alwaysDisabled || !editMode}
                    className="w-full p-2 mt-1 rounded-md border border-purple-300 dark:border-gray-600 focus:ring-[#67B7D1] focus:border-[#67B7D1] dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              ))}

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Gender
                </label>
                <select
                  name="gender"
                  value={avatrFrom.gender}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full p-2 mt-1 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-[#67B7D1] focus:border-[#67B7D1] dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Gender</option>
                  {['male', 'female', 'other'].map((g) => (
                    <option key={g} value={g}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Bio</label>
                <textarea
                  name="bio"
                  value={avatrFrom.bio}
                  onChange={handleChange}
                  rows={3}
                  disabled={!editMode}
                  className="w-full p-2 mt-1 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-[#67B7D1] focus:border-[#67B7D1] resize-none dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>

              {editMode && (
                <div className="md:col-span-2 flex justify-between mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    type="button"
                    className="bg-orange-300 hover:bg-[#d47d6f] dark:bg-[#f28b7e] dark:hover:bg-[#e67164] text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: formChanged ? 1.05 : 1 }}
                    whileTap={{ scale: formChanged ? 0.95 : 1 }}
                    type="submit"
                    disabled={!formChanged}
                    className={`px-6 py-2 rounded-md font-medium shadow 
                      ${formChanged
                        ? 'bg-[#67B7D1] hover:bg-[#58a5c3] dark:bg-[#3b9fc1] dark:hover:bg-[#2f91b2] text-white'
                        : 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    Update Profile
                  </motion.button>
                </div>
              )}
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AvtarPage;