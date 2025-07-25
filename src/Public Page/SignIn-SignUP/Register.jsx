import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineDateRange } from "react-icons/md";
import { FiMail } from 'react-icons/fi';
import { ImMobile } from "react-icons/im";
import { LuLockKeyhole } from 'react-icons/lu';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Register() {
  const [userRegister, setUserRegister] = useState({
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    dob: '',
    gender: '',
    password: '',
    confirmpassword: '',
  });

  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const RegisterSchema = Yup.object().shape({
    firstname: Yup.string().min(3, 'First name must be at least 3 characters').required('First name is required'),
    lastname: Yup.string().min(3, 'Last name must be at least 3 characters').required('Last name is required'),
    email: Yup.string().matches(/\S+@\S+\.\S+/, 'Invalid email').required('Email is required'),
    mobile: Yup.string().matches(/^\d{10}$/, 'Mobile must be 10 digits').required('Mobile is required'),
    dob: Yup.string().required('Date of birth is required'),
    gender: Yup.string().required('Gender is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserRegister((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    setIsLoading(true);

    try {
      await RegisterSchema.validate(userRegister, { abortEarly: false });
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((validationError) => {
        validationErrors[validationError.path] = validationError.message;
      });
      setError(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const { firstname, lastname, email, mobile, dob, gender, password } = userRegister;
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP}/api/auth/signup`, {
        firstname, lastname, email, mobile, dob, gender, password,
      });

      const { success } = response.data;
      if (success) {
        toast.success('Registration Successful! Please verify OTP.');
        navigate('/otp-verify', { state: { email } });
      }
    } catch (err) {
      setError({
        form: err.response?.data?.message || 'Registration failed. Please try again later.',
      });
      toast.error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen overflow-hidden">
      {/* Left Image */}
      <div className="relative hidden md:block">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="Register Visual"
          className="object-cover w-full h-full"
        />
        <div className="absolute bottom-8 left-8 text-white text-2xl font-light">
          Update your app, not your users’ patience.
        </div>
      </div>

      {/* Right Form */}
      <div className="h-screen flex flex-col justify-center items-center bg-white">
        <div className="w-[700px] border border-gray-200 p-6 rounded-xl shadow-lg">
          {/*title*/}
          <div className="text-center text-gray-800 mb-6">
            <h2 className="text-3xl font-bold mb-1">Create an Account</h2>
            <p className="text-sm text-gray-500">
              Sign up to get started with&nbsp;
              <span className="bg-gradient-to-r from-[#09A6F3] to-[#0C63E7] text-transparent bg-clip-text font-semibold">
                VIBE TALK
              </span>
            </p>
          </div>

          {/* API Error */}
          {error.form && (
            <p className="mb-4 text-center text-red-400 bg-red-50 rounded-2xl border border-red-600 p-3">
              {error.form}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            {/* First and Last Name */}
            <div className="flex gap-4 mb-2">
              <div className="w-1/2">
                <label className="text-black font-semibold">First Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <IoPersonOutline className='mt-[6px]' />
                  </span>
                  <input
                    type="text"
                    name="firstname"
                    value={userRegister.firstname}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className="w-full p-3 mt-1 pl-10 rounded-2xl bg-[#E5E7EB] text-black border border-gray-300
                    focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  />
                </div>
                {error.firstname && <p className="text-sm text-red-500">{error.firstname}</p>}
              </div>
              <div className="w-1/2">
                <label className="text-black font-semibold">Last Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <IoPersonOutline className='mt-[6px]' />
                  </span>
                  <input
                    type="text"
                    name="lastname"
                    value={userRegister.lastname}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className="w-full p-3 mt-1 pl-10 rounded-2xl bg-[#E5E7EB] text-black border border-gray-300
                    focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  />
                </div>
                {error.lastname && <p className="text-sm text-red-500">{error.lastname}</p>}
              </div>
            </div>

            {/* DOB & Gender */}
            <div className="flex gap-4 mb-2">
              <div className="w-1/2">
                <label className="text-black font-semibold">Date of Birth</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <MdOutlineDateRange className='mt-[6px]' />
                  </span>
                  <input
                    type="date"
                    name="dob"
                    value={userRegister.dob}
                    onChange={handleChange}
                    className="w-full p-3 mt-1 pl-10 rounded-2xl bg-[#E5E7EB] text-black border border-gray-300
                    focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  />
                </div>
                {error.dob && <p className="text-sm text-red-500">{error.dob}</p>}
              </div>
              <div className="w-1/2">
                <label className="text-black font-semibold">Gender</label>
                <div className="flex gap-4 mt-2">
                  {['male', 'female', 'other'].map((g) => (
                    <label key={g} className="capitalize text-black">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={userRegister.gender === g}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {g}
                    </label>
                  ))}
                </div>
                {error.gender && <p className="text-sm text-red-500">{error.gender}</p>}
              </div>
            </div>

            {/* Email & Mobile */}
            <div className="flex gap-4 mb-2">
              <div className="w-1/2">
                <label className="text-black font-semibold">Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2  text-gray-500
                  focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500">
                    <FiMail className='mt-[6px]' />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={userRegister.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="w-full p-3 mt-1 pl-10 rounded-2xl bg-[#E5E7EB] text-black border border-gray-300
                    focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  />
                </div>
                {error.email && <p className="text-sm text-red-500">{error.email}</p>}
              </div>
              <div className="w-1/2">
                <label className="text-black font-semibold">Mobile</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <ImMobile className='mt-[6px]' />
                  </span>
                  <input
                    type="text"
                    name="mobile"
                    value={userRegister.mobile}
                    onChange={handleChange}
                    placeholder="Enter mobile"
                    className="w-full p-3 mt-1 pl-10 rounded-2xl bg-[#E5E7EB] text-black border border-gray-300
                    focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  />
                </div>
                {error.mobile && <p className="text-sm text-red-500">{error.mobile}</p>}
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="flex gap-4 mb-2">
              <div className="w-1/2">
                <label className="text-black font-semibold">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <LuLockKeyhole className='mt-[6px]' />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={userRegister.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full p-3 mt-1 pl-10 pr-10 rounded-2xl bg-[#E5E7EB] text-black border border-gray-300
                    focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  />
                  <span
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl cursor-pointer"
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    {showPassword ? <FaEyeSlash className='mt-[6px]' /> : <FaEye className='mt-[6px]' />}
                  </span>
                </div>
                {error.password && <p className="text-sm text-red-500">{error.password}</p>}
              </div>
              <div className="w-1/2">
                <label className="text-black font-semibold">Confirm Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500
                  focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500">
                    <LuLockKeyhole className='mt-[6px]' />
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmpassword"
                    value={userRegister.confirmpassword}
                    onChange={handleChange}
                    placeholder="Enter confirm password"
                    className="w-full p-3 mt-1 pl-10 pr-10 rounded-2xl bg-[#E5E7EB] text-black border border-gray-300
                    focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  />
                  <span
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl cursor-pointer"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                  >
                    {showConfirmPassword ? <FaEyeSlash className='mt-[6px]' /> : <FaEye className='mt-[6px]' />}
                  </span>
                </div>
                {error.confirmpassword && <p className="text-sm text-red-500">{error.confirmpassword}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full p-3 rounded-2xl text-white font-semibold ${isLoading
                  ? 'bg-[#3799FA] cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#0D41E1] via-[#0A85ED] to-[#07C8F9] hover:from-[#0C63E7] hover:via-[#0A85ED] hover:to-[#09A6F3]'
                  }`}
              >
                {isLoading ? 'Registering...' : 'Sign Up'}
              </button>
            </div>
          </form>
          {/* Divider hr */}
          <div className="flex items-center my-6 text-sm mx-3">
            <div className="flex-grow border-t border-[#0D41E1]"></div>
            <span className="px-3 bg-gradient-to-r from-[#1E90FF] to-[#3799FA] bg-clip-text text-transparent">
              Or login with
            </span>
            <div className="flex-grow border-t border-[#0D41E1]"></div>
          </div>

          {/* Social Ragister */}
          <div className="flex justify-between mx-3 gap-4 mt-2">
            <button
              type="button"
              className="w-60 flex items-center justify-center gap-3 px-9 py-2 border border-gray-300 rounded cursor-pointer"
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                className="h-4"
                alt="Google"
              />
              Google
            </button>

            <button
              type="button"
              className="w-60 flex items-center justify-center gap-3 px-9 py-2 border border-gray-300 rounded cursor-pointer"
            >
              <img
                src="https://www.svgrepo.com/show/512317/github-142.svg"
                className="h-4"
                alt="GitHub"
              />
              GitHub
            </button>
          </div>



        </div>
        <div>
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/" className="text-[#0C63E7] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-2 text-xs text-center text-gray-500">
          © 2025 Releasium Inc. All rights reserved. &nbsp;|&nbsp;
          <Link to="#" className="hover:underline font-medium text-[#bb5b5b]">Privacy Policy</Link> &nbsp;|&nbsp;
          <Link to="#" className="hover:underline font-medium text-[#bb5b5b]">Terms & Conditions</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
