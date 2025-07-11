import React, { useEffect, useRef, useState } from 'react';
import { MdEdit } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { updateProfile } from '../feature/Slice/Updateprofile';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

function AvtarPage() {
    const user = useSelector(state => state.loginuser.userData);
    const profileStatus = useSelector(state => state.updateProfile.status);
    const dispatch = useDispatch();

    const [avatrFrom, setAvtarFrom] = useState({
        firstname: '',
        lastname: '',
        email: '',
        mobile: '',
        dob: '',
        gender: '',
        bio: '',
        profile_avatar: null
    });

    const [initialFormData, setInitialFormData] = useState(null);
    const [error, setError] = useState({});
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
                profile_avatar: user.profile_avatar || null
            };
            setAvtarFrom(formatted);
            setInitialFormData(formatted);
            if (formatted.profile_avatar) {
                setPreview(formatted.profile_avatar);
            }
        }
    }, [user]);

    useEffect(() => {
        if (profileStatus === 'succeeded') {
            toast.success("Profile updated successfully!");
            setEditMode(false);
        }
    }, [profileStatus]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newForm = { ...avatrFrom, [name]: value };
        setAvtarFrom(newForm);
        setFormChanged(JSON.stringify(newForm) !== JSON.stringify(initialFormData));
        if (error[name]) {
            setError({ ...error, [name]: '' });
        }
    };

    const handleImageClick = () => fileInputRef.current.click();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvtarFrom(prev => ({ ...prev, profile_avatar: file }));
            setPreview(URL.createObjectURL(file));
            setFormChanged(true);
        }
    };

    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let avatarBase64 = avatrFrom.profile_avatar;
            if (avatarBase64 && typeof avatarBase64 !== 'string') {
                avatarBase64 = await toBase64(avatarBase64);
            }
            await dispatch(updateProfile({ ...avatrFrom, profile_avatar: avatarBase64 }));
            setFormChanged(false);
            setInitialFormData({ ...avatrFrom, profile_avatar: avatarBase64 });
        } catch (error) {
            console.error("Update Error:", error);
            toast.error("Something went wrong.");
        }
    };

    const handleCancel = () => {
        setAvtarFrom(initialFormData);
        setPreview(initialFormData?.profile_avatar || null);
        setFormChanged(false);
        setEditMode(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
            <div className="relative w-full max-w-3xl bg-gray-950 text-white rounded-2xl shadow-2xl p-8">

                {/* Edit Button */}
                {!editMode && (
                    <button
                        onClick={() => setEditMode(true)}
                        className="absolute top-4 left-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-md"
                    >
                        Edit Profile
                    </button>
                )}

                <div className="flex flex-col items-center">
                    {/* Avatar */}
                    <div className="relative mb-6">
                        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-green-500 shadow-lg">
                            {preview ? (
                                <img src={preview} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                        </div>
                        {editMode && (
                            <>
                                <button
                                    onClick={handleImageClick}
                                    className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md"
                                >
                                    <MdEdit className="text-xl text-green-700" />
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

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: "First Name", name: "firstname" },
                            { label: "Last Name", name: "lastname" },
                            { label: "Email", name: "email", type: "email", alwaysDisabled: true },
                            { label: "Mobile", name: "mobile" },
                            { label: "Date of Birth", name: "dob", type: "date" }
                        ].map((field, idx) => (
                            <div key={idx}>
                                <label>{field.label}</label>
                                <input
                                    type={field.type || "text"}
                                    name={field.name}
                                    value={avatrFrom[field.name]}
                                    onChange={handleChange}
                                    disabled={field.alwaysDisabled || !editMode}
                                    className="w-full p-2 rounded-md bg-black border border-green-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        ))}

                        {/* Gender */}
                        <div>
                            <label>Gender</label>
                            <select
                                name="gender"
                                value={avatrFrom.gender}
                                onChange={handleChange}
                                disabled={!editMode}
                                className="w-full p-2 rounded-md bg-black border border-green-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="">Select Gender</option>
                                {["male", "female", "other"].map((g) => (
                                    <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
                                ))}
                            </select>
                        </div>

                        {/* Bio */}
                        <div className="md:col-span-2">
                            <label>Bio</label>
                            <textarea
                                name="bio"
                                value={avatrFrom.bio}
                                onChange={handleChange}
                                rows={3}
                                disabled={!editMode}
                                className="w-full p-2 rounded-md bg-black border border-green-500 text-white resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                            ></textarea>
                        </div>

                        {/* Buttons */}
                        {editMode && (
                            <div className="md:col-span-2 flex justify-between mt-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCancel}
                                    type="button"
                                    className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md"
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
                                            ? "bg-green-600 hover:bg-green-700 text-white"
                                            : "bg-gray-600 text-gray-300 cursor-not-allowed"}`}
                                >
                                    Update Profile
                                </motion.button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AvtarPage;
