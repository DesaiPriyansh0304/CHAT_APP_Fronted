import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addToken } from '../../feature/Slice/Auth/AuthSlice';
import * as Yup from 'yup';
import { FiMail } from 'react-icons/fi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { LuLockKeyhole } from 'react-icons/lu';

function Login() {
  const [userLogin, setUserLogin] = useState({ email: '', password: '' });
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  {/*validation in from*/ }
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .matches(/\S+@\S+\.\S+/, 'Email format is invalid')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  {/*from data handle*/ }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserLogin((prev) => ({ ...prev, [name]: value }));
  };

  {/*Yap validation check and api call*/ }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    setIsLoading(true);

    //First: Yup validation
    try {
      await LoginSchema.validate(userLogin, { abortEarly: false });
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((validationError) => {
        validationErrors[validationError.path] = validationError.message;
      });
      setError(validationErrors);
      setIsLoading(false);
      return; // Stop here if validation fails
    }

    //Second: Call API
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP}/api/auth/signin`,
        userLogin
      );

      const { success, token } = response.data;

      if (success && token) {
        dispatch(addToken({ token }));
        toast.success('Login Successful');
        navigate('/');
      } else {
        throw new Error('Invalid login response');
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Login failed. Please try again later.';
      setError({ form: errorMessage });
      toast.error('Login unsuccessful');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen bg-white overflow-hidden">
      {/* Left Image */}
      <div className="relative hidden md:block">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="Login"
          className="object-cover w-full h-full"
        />
        <div className="absolute bottom-8 left-8 text-white text-2xl font-light">
          Update your app, not your users’ patience.
        </div>
      </div>

      {/* Right Form */}
      <div className="h-screen flex flex-col justify-center items-center bg-white">
        <div className="w-[450px] border border-gray-200 p-6 rounded-xl shadow-lg">
          {/*title*/}
          <div className="flex flex-col items-center justify-center gap-2 text-gray-800 mb-6">
            <p className="text-3xl font-bold mb-1">Sign In</p>
            <span className="text-sm text-gray-600">Welcome back! Please enter your details</span>
          </div>

          {/* API error */}
          <div className="mx-3">
            {error.form && (
              <p className="mb-4 text-center text-red-400 bg-red-50 rounded-2xl border border-red-600 p-3">
                {error.form}
              </p>
            )}
          </div>

          {/*form data*/}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4 mx-3">
              <label htmlFor="email" className="text-black font-semibold">Email</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <FiMail className='mt-[6px]' />
                </span>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full p-3 pl-10 mt-1 rounded-2xl bg-[#E5E7EB] text-black  border border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  value={userLogin.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              {error.email && <p className="mt-1 text-sm text-red-500">{error.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-4 mx-3">
              <label htmlFor="password" className="text-black font-semibold">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <LuLockKeyhole className='mt-[6px]' />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  className="w-full p-3 pl-10 pr-10 mt-1 rounded-2xl bg-[#E5E7EB] text-black border border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  value={userLogin.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-400"
                >
                  {showPassword ? <FaEyeSlash className='mt-[6px]' /> : <FaEye className='mt-[6px]' />}
                </span>
              </div>
              {error.password && <p className="mt-1 text-sm text-red-500">{error.password}</p>}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mb-6 text-sm">
              <Link
                to="/forget-password"
                state={{ email: userLogin.email }}
                className="mx-3 bg-gradient-to-r from-[#09A6F3] to-[#0C63E7] text-transparent bg-clip-text font-semibold hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <div className="mx-3">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full p-3 rounded-2xl text-white font-semibold ${isLoading
                  ? 'bg-[#3799FA] cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#0D41E1] via-[#0A85ED] to-[#07C8F9] hover:from-[#0C63E7] hover:via-[#0A85ED] hover:to-[#09A6F3]'
                  }`}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>

            {/* Divider hr */}
            <div className="flex items-center my-6 text-sm mx-3">
              <div className="flex-grow border-t border-[#0D41E1]"></div>
              <span className="px-3 bg-gradient-to-r from-[#1E90FF] to-[#3799FA] bg-clip-text text-transparent">
                Or login with
              </span>
              <div className="flex-grow border-t border-[#0D41E1]"></div>
            </div>

            {/* Social Login */}
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

          </form>
        </div>

        {/*register link*/}
        <div>
          <p className="mt-6 text-center text-sm text-gray-500">
            Don’t have an account?{' '}
            <Link to="/register" className="text-[#0C63E7] font-semibold hover:underline">
              SignUp
            </Link>
          </p>
        </div>

        {/*Privacy and Terms */}
        <div className="mt-6 text-xs text-center text-gray-500">
          © 2025 Releasium Inc. All rights reserved. &nbsp;|&nbsp;
          <Link to="#" className="hover:underline font-medium text-[#bb5b5b]">Privacy Policy</Link> &nbsp;|&nbsp;
          <Link to="#" className="hover:underline font-medium text-[#bb5b5b]">Terms & Conditions</Link>
        </div>

      </div>
    </div>
  );
}

export default Login;
