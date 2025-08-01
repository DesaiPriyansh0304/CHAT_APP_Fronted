import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { addToken } from '../../feature/Slice/Auth/AuthSlice';
import * as Yup from 'yup';
import { FiMail } from 'react-icons/fi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { LuLockKeyhole } from 'react-icons/lu';
import { useGoogleLogin } from "@react-oauth/google";

function Login() {
  const [userLogin, setUserLogin] = useState({ email: '', password: '' });
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  // GitHub OAuth configuration - Dynamic based on environment
  const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

  // Get current domain for redirect URI
  const getCurrentDomain = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'http://localhost:5173'; // fallback
  };

  const REDIRECT_URI = `${getCurrentDomain()}/github/callback`;
  const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user:email`;

  // Validation schema
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .matches(/\S+@\S+\.\S+/, 'Email format is invalid')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  // Handle GitHub callback
  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('GitHub OAuth Error:', error);
      toast.error('GitHub login was cancelled or failed');
      navigate('/login', { replace: true });
      return;
    }

    if (code) {
      handleGithubCallback(code);
    }
  }, [searchParams]);

  // GitHub callback handler
  const handleGithubCallback = async (code) => {
    try {
      setIsGithubLoading(true);
      console.log('GitHub Auth Code:', code);
      console.log('Redirect URI used:', REDIRECT_URI);

      // Send authorization code to backend
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP}/api/auth/github`,
        {
          code,
          redirect_uri: REDIRECT_URI // Send redirect URI to backend for verification
        }
      );

      const { success, token, userData } = response.data;

      if (success && token) {
        dispatch(addToken({ token }));
        toast.success(`Welcome ${userData.firstname}! GitHub Login Successful`);
        navigate('/', { replace: true });
      } else {
        throw new Error('Invalid GitHub login response');
      }
    } catch (error) {
      console.error('GitHub Login Error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'GitHub login failed. Please try again.';

      setError({ form: errorMessage });
      toast.error('GitHub login unsuccessful');
      navigate('/login', { replace: true });
    } finally {
      setIsGithubLoading(false);
    }
  };

  // Form data handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserLogin((prev) => ({ ...prev, [name]: value }));
  };

  // Regular form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    setIsLoading(true);

    // First: Yup validation
    try {
      await LoginSchema.validate(userLogin, { abortEarly: false });
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((validationError) => {
        validationErrors[validationError.path] = validationError.message;
      });
      setError(validationErrors);
      setIsLoading(false);
      return;
    }

    // Second: Call API
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

  // Google OAuth Success Handler
  const handleGoogleSuccess = async (authResult) => {
    try {
      setIsGoogleLoading(true);
      console.log('Google Auth Result:', authResult);

      if (authResult?.code) {
        // Send authorization code to backend
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP}/api/auth/google`,
          { code: authResult.code }
        );

        const { success, token, userData } = response.data;

        if (success && token) {
          dispatch(addToken({ token }));
          toast.success(`Welcome ${userData.firstname}! Google Login Successful`);
          navigate('/');
        } else {
          throw new Error('Invalid Google login response');
        }
      }
    } catch (error) {
      console.error('Google Login Error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Google login failed. Please try again.';

      setError({ form: errorMessage });
      toast.error('Google login unsuccessful');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Google OAuth Error Handler
  const handleGoogleError = (error) => {
    console.error('Google OAuth Error:', error);
    setError({ form: 'Google login failed. Please try again.' });
    toast.error('Google login failed');
    setIsGoogleLoading(false);
  };

  // Google Login Hook
  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    flow: 'auth-code',
  });

  // GitHub login handler
  const handleGithubLogin = () => {
    if (!GITHUB_CLIENT_ID) {
      toast.error('GitHub Client ID not configured');
      return;
    }

    console.log('GitHub OAuth URL:', GITHUB_OAUTH_URL);
    console.log('Redirect URI:', REDIRECT_URI);

    setIsGithubLoading(true);
    // Redirect to GitHub OAuth
    window.location.href = GITHUB_OAUTH_URL;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-white">
      {/* Left Image */}
      <div className="relative hidden md:block">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="Login"
          className="object-cover w-full h-full"
        />
        <div className="absolute bottom-8 left-8 text-white text-xl lg:text-2xl font-light max-w-md">
          Update your app, not your users' patience.
        </div>
      </div>

      {/* Right Form */}
      <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4 py-8 md:px-6">
        <div className="w-full max-w-md mx-auto border border-gray-200 p-4 sm:p-6 rounded-xl shadow-lg">
          {/* Title */}
          <div className="flex flex-col items-center justify-center gap-2 text-gray-800 mb-6">
            <p className="text-2xl sm:text-3xl font-bold mb-1">Sign In</p>
            <span className="text-sm text-gray-600 text-center">Welcome back! Please enter your details</span>
          </div>

          {/* API error */}
          <div className="mx-2 sm:mx-3">
            {error.form && (
              <p className="mb-4 text-center text-red-400 bg-red-50 rounded-2xl border border-red-600 p-3 text-sm">
                {error.form}
              </p>
            )}
          </div>

          {/* Loading state for GitHub callback */}
          {isGithubLoading && (
            <div className="mb-4 text-center text-blue-600 bg-blue-50 rounded-2xl border border-blue-300 p-3 text-sm">
              Processing GitHub login...
            </div>
          )}

          {/* Form data */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4 mx-2 sm:mx-3">
              <label htmlFor="email" className="text-black font-semibold text-sm sm:text-base">Email</label>
              <div className="relative">
                <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <FiMail className='mt-[6px] text-sm sm:text-base' />
                </span>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full p-3 pl-9 sm:pl-10 mt-1 rounded-2xl bg-[#E5E7EB] text-black border border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-sm sm:text-base"
                  value={userLogin.email}
                  onChange={handleChange}
                  disabled={isLoading || isGoogleLoading || isGithubLoading}
                />
              </div>
              {error.email && <p className="mt-1 text-xs sm:text-sm text-red-500">{error.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-4 mx-2 sm:mx-3">
              <label htmlFor="password" className="text-black font-semibold text-sm sm:text-base">Password</label>
              <div className="relative">
                <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <LuLockKeyhole className='mt-[6px] text-sm sm:text-base' />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  className="w-full p-3 pl-9 sm:pl-10 pr-10 mt-1 rounded-2xl bg-[#E5E7EB] text-black border border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-sm sm:text-base"
                  value={userLogin.password}
                  onChange={handleChange}
                  disabled={isLoading || isGoogleLoading || isGithubLoading}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 cursor-pointer text-lg sm:text-xl text-gray-400"
                >
                  {showPassword ? <FaEyeSlash className='mt-[6px]' /> : <FaEye className='mt-[6px]' />}
                </span>
              </div>
              {error.password && <p className="mt-1 text-xs sm:text-sm text-red-500">{error.password}</p>}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mb-6 text-xs sm:text-sm">
              <Link
                to="/forget-password"
                state={{ email: userLogin.email }}
                className="mx-2 sm:mx-3 bg-gradient-to-r from-[#09A6F3] to-[#0C63E7] text-transparent bg-clip-text font-semibold hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <div className="mx-2 sm:mx-3">
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading || isGithubLoading}
                className={`w-full p-3 rounded-2xl text-white font-semibold text-sm sm:text-base ${isLoading || isGoogleLoading || isGithubLoading
                  ? 'bg-[#3799FA] cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#0D41E1] via-[#0A85ED] to-[#07C8F9] hover:from-[#0C63E7] hover:via-[#0A85ED] hover:to-[#09A6F3] cursor-pointer'
                  }`}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>

            {/* Divider hr */}
            <div className="flex items-center my-6 text-xs sm:text-sm mx-2 sm:mx-3">
              <div className="flex-grow border-t border-[#0D41E1]"></div>
              <span className="px-2 sm:px-3 bg-gradient-to-r from-[#1E90FF] to-[#3799FA] bg-clip-text text-transparent whitespace-nowrap">
                Or login with
              </span>
              <div className="flex-grow border-t border-[#0D41E1]"></div>
            </div>

            {/* Social Login */}
            <div className="flex flex-col sm:flex-row mx-2 justify-between sm:mx-3 gap-3 sm:gap-4 mt-2">
              {/* Google Button */}
              <button
                type="button"
                className={`w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 border border-gray-300 rounded-md text-sm sm:text-base font-medium transition-colors ${isGoogleLoading || isLoading || isGithubLoading
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer hover:bg-gray-100'
                  }`}
                onClick={googleLogin}
                disabled={isGoogleLoading || isLoading || isGithubLoading}
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  className="h-4 sm:h-5"
                  alt="Google"
                />
                {isGoogleLoading ? 'Signing In...' : 'Google'}
              </button>

              {/* GitHub Button */}
              <button
                type="button"
                className={`w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 border border-gray-300 rounded-md text-sm sm:text-base font-medium transition-colors ${isGithubLoading || isLoading || isGoogleLoading
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer hover:bg-gray-100'
                  }`}
                onClick={handleGithubLogin}
                disabled={isGithubLoading || isLoading || isGoogleLoading}
              >
                <img
                  src="https://www.svgrepo.com/show/512317/github-142.svg"
                  className="h-4 sm:h-5"
                  alt="GitHub"
                />
                {isGithubLoading ? 'Signing In...' : 'GitHub'}
              </button>
            </div>

          </form>
        </div>

        {/* Register link */}
        <div className="mt-4 sm:mt-6 px-4">
          <p className="text-center text-xs sm:text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#0C63E7] font-semibold hover:underline">
              SignUp
            </Link>
          </p>
        </div>

        {/* Privacy and Terms */}
        <div className="mt-4 sm:mt-6 text-xs text-center text-gray-500 px-4  leading-relaxed">
          <div className="mb-1">© 2025 Releasium Inc. All rights reserved.</div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-2">
            <Link to="#" className="hover:underline font-medium text-[#bb5b5b]">Privacy Policy</Link>
            <span className="hidden sm:inline">||</span>
            <Link to="#" className="hover:underline font-medium text-[#bb5b5b]">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;