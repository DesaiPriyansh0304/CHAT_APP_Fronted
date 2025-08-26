import React, { useState } from 'react';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { BiMessageDetail } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';

function ContactAdd({ onClose, onContactAdded }) {

    const [email, setEmail] = useState('');            //email
    const [message, setMessage] = useState('');        //message     
    const [errors, setErrors] = useState({});          //error 
    const [loading, setLoading] = useState(false);     //loading     

    // form validation 
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
        message: Yup.string()
            .min(20, 'Message must be at least 20 characters')
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

            if (!token) {
                toast.error("Authentication token not found");
                setLoading(false);
                return;
            }

            //api call
            const response = await axios.post(`${URL}/api/auth/invite/invitedUsers`,
                { email, message },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // FIXED: axios response structure
            if (response.status === 200) {
                toast.success('Invitation sent successfully!');
                // Reset form
                setEmail('');
                setMessage('');
                //Call the success callback to refresh contacts
                if (onContactAdded) {
                    onContactAdded();
                } else {
                    onClose();
                }
            } else {
                toast.error(response.data?.message || 'Failed to send invite.');
            }
        } catch (error) {
            if (error.name === 'ValidationError') {
                const formErrors = {};
                error.inner.forEach((e) => {
                    formErrors[e.path] = e.message;
                });
                setErrors(formErrors);
            } else {
                console.log('Invite error:', error);
                // FIXED: Better error handling for axios
                if (error.response) {
                    toast.error(error.response.data?.message || 'Failed to send invite.');
                } else if (error.request) {
                    toast.error('Network error. Please try again.');
                } else {
                    toast.error('Something went wrong!');
                }
            }
        }
        setLoading(false);
    };

    // Force lowercase email
    const handleEmailChange = (e) => {
        setEmail(e.target.value.toLowerCase());
    };

    // Handle key press inside textarea
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey && e.target.type !== "textarea") {
            e.preventDefault();
            handleInvite();
        }
    };

    return (
        <>
            <div className="bg-[#f8f7ff] rounded-xl shadow-lg w-[500px] max-w-md mx-auto p-4 sm:p-6 relative"
                onKeyDown={handleKeyDown}>
                {/* title and Close Button */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="exo-bold text-lg sm:text-xl font-bold text-gray-800">
                        Add Contact
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-cyan-600 text-xl font-semibold cursor-pointer touch-manipulation"
                    >
                        <RxCross2 />
                    </button>
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="exo-bold block text-sm font-xl font-semibold text-gray-700 mb-2">
                        Email
                    </label>
                    <div className="relative">
                        {/* Icon inside input */}
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 text-xl">
                            <MdOutlineMarkEmailRead />
                        </span>
                        <input
                            type="email"
                            placeholder="Enter email"
                            className={`exo w-full pl-10 pr-3 py-3 border ${errors.email ? "border-red-500" : "border-cyan-300"
                                } rounded-md  text-base`}
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-sm text-red-500 mt-0.5">{errors.email}</p>
                    )}
                </div>

                {/* Message */}
                <div className="mb-6">
                    <label className="exo-bold block text-sm font-xl font-semibold text-gray-700 mb-2">
                        Invitation Message
                    </label>
                    <div className="relative">
                        <span className="absolute  left-3 top-3 text-cyan-400 text-xl mt-[5px]">
                            <BiMessageDetail />
                        </span>
                        <textarea
                            placeholder="Enter a Message..."
                            rows={4}
                            className={`exo w-full pl-10 pr-3 py-3 border ${errors.message ? "border-red-500" : "border-cyan-300"
                                } rounded-md text-base`}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{ resize: "vertical", minHeight: "50px" }}
                        />
                    </div>
                    {errors.message && (
                        <p className="text-sm text-red-500 mt-0.5">{errors.message}</p>
                    )}
                </div>

                {/* Actions close & Invited Contact */}
                <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto text-white px-5 py-2 bg-gray-600 rounded-md hover:bg-gray-700 transition-colors cursor-pointer touch-manipulation"
                        disabled={loading}
                    >
                        Close
                    </button>
                    <button
                        onClick={handleInvite}
                        disabled={loading}
                        className="w-full sm:w-auto bg-cyan-100 text-cyan-600 font-medium px-4 py-1 rounded-md outline-2 outline-cyan-500 hover:bg-cyan-700 hover:text-white  disabled:bg-cyan-300 disabled:text-gray-400 transition-colors cursor-pointer touch-manipulation"
                    >
                        {loading ? 'Sending...' : 'Invite Contact'}
                    </button>
                </div>
            </div>
        </>
    );
}

export default ContactAdd;