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
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen overflow-auto">
      {/* Left Image */}
      <div className="relative hidden md:block">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="Register Visual"
          className="object-cover w-full h-full"
        />
        <div className="absolute bottom-8 left-8 text-white text-xl lg:text-2xl font-light max-w-md">
          Update your app, not your users' patience.
        </div>
      </div>

      {/* Right Form */}
      <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4 py-8 md:px-6">
        <div className="w-full max-w-4xl mx-auto border border-gray-200 p-4 sm:p-6 rounded-xl shadow-lg">
          {/*title*/}
          <div className="text-center text-gray-800 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-1">Create an Account</h2>
            <p className="text-sm text-gray-500">
              Sign up to get started with&nbsp;
              <span className="bg-gradient-to-r from-[#09A6F3] to-[#0C63E7] text-transparent bg-clip-text font-semibold">
                VIBE TALK
              </span>
            </p>
          </div>

          {/* API Error */}
          {error.form && (
            <p className="mb-4 text-center text-red-400 bg-red-50 rounded-2xl border border-red-600 p-3 text-sm mx-2 sm:mx-0">
              {error.form}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mx-2 sm:mx-0">
            {/* First and Last Name */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
              <div className="w-full sm:w-1/2">
                <label className="text-black font-semibold text-sm sm:text-base">First Name</label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <IoPersonOutline className='mt-[6px] text-sm sm:text-base' />
                  </span>
                  <input
                    type="text"
                    name="firstname"
                    value={userRegister.firstname}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className="w-full p-3 mt-1 pl-9 sm:pl-10 rounded-2xl bg-[#E5E7EB] text-black border border-gray-300
                    focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-sm sm:text-base"
                  />
                </div>
                {error.firstname && <p className="text-xs sm:text-sm text-red-500 mt-1">{error.firstname}</p>}
              </div>
              <div className="w-full sm:w-1/2">
                <label className="text-black font-semibold text-sm sm:text-base">Last Name</label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <IoPersonOutline className='mt-[6px] text-sm sm:text-base' />
                  </span>
                  <input
                    type="text"
                    name="lastname"
                    value={userRegister.lastname}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className="w-full p-3 mt-1 pl-9 sm:pl-10 rounded-2xl bg-[#E5E7EB] text-black border border-gray-300
                    focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-sm sm:text-base"
                  />
                </div>
                {error.lastname && <p className="text-xs sm:text-sm text-red-500 mt-1">{error.lastname}</p>}
              </div>
            </div>

            {/* DOB & Gender */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
              <div className="w-full sm:w-1/2">
                <label className="text-black font-semibold text-sm sm:text-base">Date of Birth</label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <MdOutlineDateRange className='mt-[6px] text-sm sm:text-base' />
                  </span>
                  <input
                    type="date"
                    name="dob"
                    value={userRegister.dob}
                    onChange={handleChange}
                    className="w-full p-3 mt-1 pl-9 sm:pl-10 rounded-2xl bg-[#E5E7EB] text-black border border-gray-300
                    focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-sm sm:text-base"
                  />
                </div>
                {error.dob && <p className="text-xs sm:text-sm text-red-500 mt-1">{error.dob}</p>}
              </div>
              <div className="w-full sm:w-1/2">
                <label className="text-black font-semibold text-sm sm:text-base">Gender</label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
                  {['male', 'female', 'other'].map((g) => (
                    <label key={g} className="capitalize text-black text-sm sm:text-base flex items-center">
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
                {error.gender && <p className="text-xs sm:text-sm text-red-500 mt-1">{error.gender}</p>}
              </div>
            </div>

            {/* Email & Mobile */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
              <div className="w-full sm:w-1/2">
                <label className="text-black font-semibold text-sm sm:text-base">Email</label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <FiMail className='mt-[6px] text-sm sm:text-base' />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={userRegister.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="w-full p-3 mt-1 pl-9 sm:pl-10 rounded-2xl bg-[#E5E7EB] text-black border border-gray-300
                    focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-sm sm:text-base"
                  />
                </div>
                {error.email && <p className="text-xs sm:text-sm text-red-500 mt-1">{error.email}</p>}
              </div>
              <div className="w-full sm:w-1/2">
                <label className="text-black font-semibold text-sm sm:text-base">Mobile</label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <ImMobile className='mt-[6px] text-sm sm:text-base' />
                  </span>
                  <input
                    type="text"
                    name="mobile"
                    value={userRegister.mobile}
                    onChange={handleChange}
                    placeholder="Enter mobile"
                    className="w-full p-3 mt-1 pl-9 sm:pl-10 rounded-2xl bg-[#E5E7EB] text-black border border-gray-300
                    focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-sm sm:text-base"
                  />
                </div>
                {error.mobile && <p className="text-xs sm:text-sm text-red-500 mt-1">{error.mobile}</p>}
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
              <div className="w-full sm:w-1/2">
                <label className="text-black font-semibold text-sm sm:text-base">Password</label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <LuLockKeyhole className='mt-[6px] text-sm sm:text-base' />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={userRegister.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full p-3 mt-1 pl-9 sm:pl-10 pr-10 rounded-2xl bg-[#E5E7EB] text-black border border-gray-300
                    focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-sm sm:text-base"
                  />
                  <span
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl cursor-pointer"
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    {showPassword ? <FaEyeSlash className='mt-[6px]' /> : <FaEye className='mt-[6px]' />}
                  </span>
                </div>
                {error.password && <p className="text-xs sm:text-sm text-red-500 mt-1">{error.password}</p>}
              </div>
              <div className="w-full sm:w-1/2">
                <label className="text-black font-semibold text-sm sm:text-base">Confirm Password</label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <LuLockKeyhole className='mt-[6px] text-sm sm:text-base' />
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmpassword"
                    value={userRegister.confirmpassword}
                    onChange={handleChange}
                    placeholder="Enter confirm password"
                    className="w-full p-3 mt-1 pl-9 sm:pl-10 pr-10 rounded-2xl bg-[#E5E7EB] text-black border border-gray-300
                    focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-sm sm:text-base"
                  />
                  <span
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl cursor-pointer"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                  >
                    {showConfirmPassword ? <FaEyeSlash className='mt-[6px]' /> : <FaEye className='mt-[6px]' />}
                  </span>
                </div>
                {error.confirmpassword && <p className="text-xs sm:text-sm text-red-500 mt-1">{error.confirmpassword}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full p-3 rounded-2xl text-white font-semibold text-sm sm:text-base ${isLoading
                  ? 'bg-[#3799FA] cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#0D41E1] via-[#0A85ED] to-[#07C8F9] hover:from-[#0C63E7] hover:via-[#0A85ED] hover:to-[#09A6F3] cursor-pointer'
                  }`}
              >
                {isLoading ? 'Registering...' : 'Sign Up'}
              </button>
            </div>
          </form>

          {/* Divider hr */}
          <div className="flex items-center my-6 text-xs sm:text-sm mx-2 sm:mx-3">
            <div className="flex-grow border-t border-[#0D41E1]"></div>
            <span className="px-2 sm:px-3 bg-gradient-to-r from-[#1E90FF] to-[#3799FA] bg-clip-text text-transparent whitespace-nowrap">
              Or signup with
            </span>
            <div className="flex-grow border-t border-[#0D41E1]"></div>
          </div>

          {/* Social Register */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mx-2 sm:mx-3">
            <button
              type="button"
              className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-9 py-2 border border-gray-300 rounded cursor-pointer text-sm sm:text-base hover:bg-gray-50 transition-colors"
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                className="h-3 sm:h-4"
                alt="Google"
              />
              Google
            </button>

            {/* LinkedIn Button */}
            <button
              type="button"
              className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 border border-gray-300 rounded-md text-sm sm:text-base font-medium transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <img
                src="https://www.svgrepo.com/show/448234/linkedin.svg"
                className="h-4 sm:h-5"
                alt=" LinkedIn"
              />
              LinkedIn
            </button>


            <button
              type="button"
              className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-9 py-2 border border-gray-300 rounded cursor-pointer text-sm sm:text-base hover:bg-gray-50 transition-colors"
            >
              <img
                src="https://www.svgrepo.com/show/512317/github-142.svg"
                className="h-3 sm:h-4"
                alt="GitHub"
              />
              GitHub
            </button>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 px-4">
          <p className="text-center text-xs sm:text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/" className="text-[#0C63E7] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-4 sm:mt-6 text-xs text-center text-gray-500 px-4  leading-relaxed">
          <div className="mb-1">© 2025 Releasium Inc. All rights reserved.</div>
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
            <Link to="#" className="hover:underline font-medium text-[#bb5b5b]">Privacy Policy</Link>
            <span className="hidden sm:inline">||</span>
            <Link to="#" className="hover:underline font-medium text-[#bb5b5b]">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;