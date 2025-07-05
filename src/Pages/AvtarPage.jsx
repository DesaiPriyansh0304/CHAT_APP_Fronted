import React, { useEffect, useRef, useState } from 'react';
import { MdEdit } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { TbMessageDots } from "react-icons/tb";
import { IoCallSharp, IoVideocam } from "react-icons/io5";
import { TiHome } from "react-icons/ti";
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { updateProfile } from '../feature/Slice/Updateprofile';
import toast from 'react-hot-toast';

function AvtarPage() {
    const user = useSelector(state => state.auth.user);
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

    const [error, setError] = useState({});
    const [clickEffect, setClickEffect] = useState(null);
    const [preview, setPreview] = useState(null);
    const [formChanged, setFormChanged] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setAvtarFrom(prev => ({
                ...prev,
                email: user.email || '',
                firstname: user.firstname || '',
                lastname: user.lastname || '',
                mobile: user.mobile || '',
                gender: user.gender
                    ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1).toLowerCase()
                    : '',
                dob: user.dob ? moment(user.dob).format('YYYY-MM-DD') : '',
                bio: user.bio || '',
                profile_avatar: user.profile_avatar || null
            }));

            if (user.profile_avatar) {
                setPreview(user.profile_avatar);
            }
        }
    }, [user]);

    useEffect(() => {
        if (profileStatus === 'succeeded') {
            toast.success("Profile updated successfully!");
        }
    }, [profileStatus]);

    const bghandleClick = (index) => {
        setClickEffect(index);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAvtarFrom((prev) => ({
            ...prev,
            [name]: value
        }));
        setFormChanged(true);
        if (error[name]) {
            setError({ ...error, [name]: '' });
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

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
            reader.onerror = (error) => reject(error);
        });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let avatarBase64 = null;

            if (avatrFrom.profile_avatar && typeof avatrFrom.profile_avatar !== 'string') {
                avatarBase64 = await toBase64(avatrFrom.profile_avatar);
            } else if (typeof avatrFrom.profile_avatar === 'string') {
                avatarBase64 = avatrFrom.profile_avatar;
            }

            await dispatch(updateProfile({
                profile_avatar: avatarBase64,
                firstname: avatrFrom.firstname,
                lastname: avatrFrom.lastname,
                bio: avatrFrom.bio,
                mobile: avatrFrom.mobile,
                dob: avatrFrom.dob,
                gender: avatrFrom.gender
            }));

            setFormChanged(false);
        } catch (error) {
            console.error("Update Error:", error);
            toast.error("Something went wrong.");
        }
    };

    const TopIcon = [
        { id: 0, icon: <TiHome />, title: "Home" },
        { id: 1, icon: <TbMessageDots />, title: "Message" },
        { id: 2, icon: <AiFillEdit />, title: "Edit" },
        { id: 3, icon: <MdEdit />, title: "Mail" },
        { id: 4, icon: <IoCallSharp />, title: "Call" },
        { id: 5, icon: <IoVideocam />, title: "Videocall" },
    ];

    return (
        <div className='flex w-full h-screen items-center justify-center'>
            <div className='flex flex-row h-[90%] w-[90%] max-w-[1200px]'>

                {/* Icon Sidebar */}
                <div className='flex-[1] border shadow-md flex items-center justify-center bg-white'>
                    <ul className="flex flex-col gap-8 p-4">
                        {TopIcon.map(({ id, icon, title }) => (
                            <li key={id} className="relative group">
                                <button
                                    className={`p-2 ${clickEffect === id
                                        ? 'bg-blue-100 text-blue-600 border border-blue-400 rounded-md'
                                        : 'text-black'} hover:text-blue-500 transition-transform duration-300 transform hover:scale-90 text-2xl`}
                                    onClick={() => bghandleClick(id)}
                                >
                                    {icon}
                                </button>
                                <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 invisible group-hover:visible
                                 opacity-0 group-hover:opacity-100 inline-block px-3 py-2 text-sm font-medium
                                  text-black bg-gray-100 rounded-lg shadow-md transition-opacity duration-300">
                                    {title}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0
                                      border-l-[6px] border-r-[6px] border-t-[6px]
                                     border-l-transparent border-r-transparent border-t-gray-100" />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Profile and Form Section */}
                <div className='flex-[3] bg-gray-200 border border-black shadow-md flex flex-col items-center relative'>
                    {/* Avatar Preview */}
                    <div className='mt-5 relative w-40 h-40'>
                        <div className='w-40 h-40 rounded-full border-4 border-white bg-gray-300' />
                        {preview && (
                            <img
                                src={preview}
                                alt="Avatar"
                                className='w-40 h-40 rounded-full border-4 border-white object-cover absolute top-0 left-0'
                            />
                        )}
                        <span
                            onClick={handleImageClick}
                            className='absolute bottom-0 right-0 bg-gray-500 text-white rounded-full p-2 border-2 border-white shadow-md cursor-pointer text-2xl'
                        >
                            <MdEdit />
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="gap-4 w-full max-w-3xl p-6 grid grid-cols-2 gap-x-6 gap-y-4"
                    >
                        {[
                            { label: "First Name", name: "firstname", type: "text" },
                            { label: "Last Name", name: "lastname", type: "text" },
                            { label: "Email", name: "email", type: "text" },
                            { label: "Mobile", name: "mobile", type: "text" },
                            { label: "Date of Birth", name: "dob", type: "date" },
                            { label: "BIO", name: "bio", type: "text" },
                            {
                                label: "Gender", name: "gender", type: "select",
                                options: ["Male", "Female", "Other"]
                            }
                        ].map(({ label, name, type, options }) => (
                            <div key={name} className="flex flex-col">
                                <label htmlFor={name} className="mb-1 font-medium text-gray-700">{label}</label>
                                {type === "select" ? (
                                    <select
                                        id={name}
                                        name={name}
                                        value={avatrFrom[name]}
                                        onChange={handleChange}
                                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="" disabled>{`Select ${label}`}</option>
                                        {options.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={type}
                                        name={name}
                                        id={name}
                                        value={avatrFrom[name]}
                                        onChange={handleChange}
                                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                )}
                                {error[name] && <span className="text-red-500 text-sm">{error[name]}</span>}
                            </div>
                        ))}

                        {formChanged && (
                            <div className="col-span-2 flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow-md"
                                >
                                    Update Profile
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Optional Section */}
                <div className='flex-[5] bg-gray-400 border border-black shadow-md flex items-center justify-center'>
                    <p>Priyansh</p>
                </div>
            </div>
        </div>
    );
}

export default AvtarPage;
