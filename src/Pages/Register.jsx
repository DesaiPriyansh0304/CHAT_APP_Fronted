import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { addUser } from '../feature/Slice/AuthSlice';
import toast from 'react-hot-toast';

function Register() {
    const [userRegister, setUserRegister] = useState({
        firstname: '',
        lastname: '',
        email: '',
        mobile: '',
        dob: '',
        gender: '',
        password: '',
    });

    const [error, setError] = useState({});
    const navigate = useNavigate();
    // const dispatch = useDispatch();

    const validateRegisterForm = () => {
        const newError = {};

        if (!userRegister.firstname || userRegister.firstname.length < 3) {
            newError.firstname = 'First name must be at least 3 characters';
        }

        if (!userRegister.lastname || userRegister.lastname.length < 3) {
            newError.lastname = 'Last name must be at least 3 characters';
        }

        if (!userRegister.email) {
            newError.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(userRegister.email)) {
            newError.email = 'Email is invalid';
        }

        if (!userRegister.mobile || !/^\d{10}$/.test(userRegister.mobile)) {
            newError.mobile = 'Mobile number must be 10 digits';
        }

        if (!userRegister.dob) {
            newError.dob = 'Date of birth is required';
        }

        if (!userRegister.gender) {
            newError.gender = 'Gender is required';
        }

        if (!userRegister.password || userRegister.password.length < 6) {
            newError.password = 'Password must be at least 6 characters';
        }

        setError(newError);
        return Object.keys(newError).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserRegister((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (error[name]) {
            setError((prevError) => ({ ...prevError, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateRegisterForm()) return;

        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP}/api/auth/signup`, userRegister);

            // const { success, user, token, userId } = response.data;

            // if (success && token) {
            //     const userData = {
            //         ...user,
            //         _id: userId, // ensure _id is set for socket
            //     };

            //     dispatch(addUser({ user: userData, token, userId }));
            //     toast.success('Registration Successful');
            //     navigate('/');
            // }


            const { success, userId } = response.data;
            console.log('✌️userId --->', userId);

            if (success) {
                toast.success('Registration Successful! Please verify OTP.');
                navigate('/otp-verify', { state: { email: userRegister.email } });
            }


        } catch (err) {
            console.error('Register Error:', err);
            setError({
                form: err.response?.data?.message || 'Registration failed. Please try again later.',
            });
            toast.error('Registration failed');
        }
    };

    return (
        <div className="flex h-screen bg-[#213448] grid-cols-[50%_50%]">
            <div className="w-full h-full">
                <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                    alt="Register Visual"
                    className="h-full w-full object-cover"
                />
                <div className="absolute bottom-8 left-8 text-white text-2xl font-light">
                    Update your app, not your users’ patience.
                </div>
            </div>

            <div className="w-full h-screen flex flex-col items-center text-white p-4">
                <div className="text-center mt-8">
                    <img src="#" alt="Logo" className="mx-auto w-12 h-12" />
                    <h2 className="text-2xl font-bold mt-2">Create an Account</h2>
                    <p className="text-sm text-gray-400">Fill in the details below to register.</p>
                </div>

                <form onSubmit={handleSubmit} className="w-full">
                    <div className="flex gap-5 mx-6 mt-4">
                        <div className="w-1/2">
                            <label>First Name</label>
                            <input type="text" name="firstname" value={userRegister.firstname} onChange={handleChange} placeholder="Enter first name" className="w-full p-3 bg-white text-black rounded" />
                            {error.firstname && <p className="text-red-500 text-sm">{error.firstname}</p>}
                        </div>

                        <div className="w-1/2">
                            <label>Last Name</label>
                            <input type="text" name="lastname" value={userRegister.lastname} onChange={handleChange} placeholder="Enter last name" className="w-full p-3 bg-white text-black rounded" />
                            {error.lastname && <p className="text-red-500 text-sm">{error.lastname}</p>}
                        </div>
                    </div>

                    <div className="flex gap-5 mx-6 mt-4">
                        <div className="w-1/2">
                            <label>Date of Birth</label>
                            <input type="date" name="dob" value={userRegister.dob} onChange={handleChange} className="w-full p-3 bg-white text-black rounded" />
                            {error.dob && <p className="text-red-500 text-sm">{error.dob}</p>}
                        </div>

                        <div className="w-1/2">
                            <label className="block mb-1">Gender</label>
                            <div className="flex gap-4">
                                {['male', 'female', 'other'].map((g) => (
                                    <label key={g} className="flex items-center capitalize">
                                        <input type="radio" name="gender" value={g} checked={userRegister.gender === g} onChange={handleChange} className="mr-2" />
                                        {g}
                                    </label>
                                ))}
                            </div>
                            {error.gender && <p className="text-red-500 text-sm">{error.gender}</p>}
                        </div>
                    </div>

                    <div className="flex gap-5 mx-6 mt-4">
                        <div className="w-1/2">
                            <label>Email</label>
                            <input type="email" name="email" value={userRegister.email} onChange={handleChange} placeholder="Enter email" className="w-full p-3 bg-white text-black rounded" />
                            {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
                        </div>

                        <div className="w-1/2">
                            <label>Mobile</label>
                            <input type="text" name="mobile" value={userRegister.mobile} onChange={handleChange} placeholder="Enter mobile number" className="w-full p-3 bg-white text-black rounded" />
                            {error.mobile && <p className="text-red-500 text-sm">{error.mobile}</p>}
                        </div>
                    </div>

                    <div className="mx-6 mt-4">
                        <label>Password</label>
                        <input type="password" name="password" value={userRegister.password} onChange={handleChange} placeholder="Enter password" className="w-full p-3 bg-white text-black rounded" />
                        {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
                    </div>

                    {error.form && <p className="text-red-500 text-center mt-2">{error.form}</p>}

                    <div className="mx-6 mt-6">
                        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-semibold">
                            Sign Up
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-green-400 hover:underline">SignIn</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
