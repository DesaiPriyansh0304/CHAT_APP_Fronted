// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addUser } from '../feature/Slice/AuthSlice';
import * as Yup from 'yup';

function Login() {
  const [userLogin, setUserLogin] = useState({ email: '', password: '' });
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Yup schema for validation
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .matches(/\S+@\S+\.\S+/, 'Email format is invalid')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserLogin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError({});

    try {
      await LoginSchema.validate(userLogin, { abortEarly: false });

      const response = await axios.post(`${import.meta.env.VITE_REACT_APP}/api/auth/signin`, userLogin);

      const { success, data, token, userId } = response.data;

      if (success && token) {
        const userData = {
          ...data,
          _id: userId, // explicitly attach userId as _id
        };

        dispatch(addUser({ user: userData, token, userId }));

        toast.success('Login Successful');
        navigate('/');
      } else {
        throw new Error('Invalid login response');
      }

    } catch (err) {
      if (err.name === 'ValidationError') {
        const validationErrors = {};
        err.inner.forEach((validationError) => {
          validationErrors[validationError.path] = validationError.message;
        });
        setError(validationErrors);
      } else {
        console.error("Login error:", err);
        setError({
          form:
            err.response?.data?.message ||
            err.message ||
            'Login failed. Please try again later.',
        });
        toast.error('Login unsuccessful');
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex h-screen bg-[#213448] grid-cols-[60%_40%] overflow-hidden">
      {/* Left Image */}
      <div className="relative w-full">
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
      <div className="w-full md:w-1/2 p-8 text-white flex flex-col justify-center">
        <div className="flex flex-col items-center mb-6">
          <img src="../../public/ImgSignup-In/1.jpg" alt="Logo" className="h-10 mb-2 rounded-full" />
          <h2 className="text-2xl font-semibold mb-2">Welcome Back to ChatApp</h2>
          <p className="text-sm text-gray-400">Enter your username and password to continue.</p>
        </div>

        {error.form && (
          <p className="mb-4 text-center text-red-500 font-medium">{error.form}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mx-6">
            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                className="w-full p-3 rounded bg-white text-black"
                value={userLogin.email}
                onChange={handleChange}
                disabled={isLoading}
              />
              {error.email && <p className="mt-1 text-sm text-red-500">{error.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block mb-1">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                className="w-full p-3 rounded bg-white text-black"
                value={userLogin.password}
                onChange={handleChange}
                disabled={isLoading}
              />
              {error.password && <p className="mt-1 text-sm text-red-500">{error.password}</p>}
            </div>

            <div className="flex justify-end mb-6 text-sm">
              <Link to="/forget-password" className="text-green-400 hover:underline">Forgot password</Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded text-white font-semibold ${isLoading
                ? 'bg-green-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800'
                }`}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="flex items-center my-6 text-sm text-cyan-50">
              <div className="flex-grow border-t border-cyan-50"></div>
              <span className="px-3">Or login with</span>
              <div className="flex-grow border-t border-cyan-50"></div>
            </div>

            <div className="flex justify-between mx-10">
              <button
                type="button"
                disabled
                className="flex items-center gap-2 px-9 py-2 border border-white rounded opacity-50 cursor-not-allowed"
              >
                <img src="https://www.svgrepo.com/show/355037/google.svg" className="h-4" alt="Google" />
                Google
              </button>
              <button
                type="button"
                disabled
                className="flex items-center gap-2 px-9 py-2 border border-white rounded opacity-50 cursor-not-allowed"
              >
                <img src="https://www.svgrepo.com/show/512317/github-142.svg" className="h-4" alt="GitHub" />
                GitHub
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-400">
              Don’t have an account?{' '}
              <Link to="/register" className="text-green-400 hover:underline">SignUp</Link>
            </p>
          </div>
        </form>

        <div className="mt-6 text-xs text-center text-cyan-50">
          © 2025 Releasium Inc. All rights reserved. &nbsp;|&nbsp;
          <Link to="#" className="hover:underline font-medium">Privacy Policy</Link> &nbsp;|&nbsp;
          <Link to="#" className="hover:underline font-medium">Terms & Conditions</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
