import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { addToken } from '../../feature/Auth/AuthSlice';
import * as Yup from 'yup';
import { FiMail } from 'react-icons/fi';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { LuLockKeyhole } from 'react-icons/lu';
import { useGoogleLogin } from "@react-oauth/google";
import { PiSignIn } from "react-icons/pi";
import ReCAPTCHA from "react-google-recaptcha";

function Login() {
  //form data
  const [userLogin, setUserLogin] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState({});                                //validation error
  const [isLoading, setIsLoading] = useState(false);                     //loading
  const [showPassword, setShowPassword] = useState(false);               //Show password
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);         //google loading
  const [isGithubLoading, setIsGithubLoading] = useState(false);         //github loading
  const [recaptcha, setRecaptcha] = useState(null);                      //recaptch 
  const [realValue, setRealValue] = useState('');                        //password value  
  const [displayValue, setDisplayValue] = useState('');                  //display value 
  const timeoutRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();


  //Google recaptcha
  const getRecaptchavalue = (value) => {
    setRecaptcha(value);
    // console.log('reCAPTCHA value:', value);
    if (value && error.recaptcha) {
      setError(prev => ({ ...prev, recaptcha: null }));
    }
  }

  const onRecaptchaExpired = () => {
    setRecaptcha(null);
    setError(prev => ({ ...prev, recaptcha: 'Security verification timed out. Please re-verify.' }));
  }



  {/*github Login*/ }
  const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

  const getCurrentDomain = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'http://localhost:5173';
  };

  const REDIRECT_URI = `${getCurrentDomain()}/github/callback`;
  const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user:email`;

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .matches(/\S+@\S+\.\S+/, 'Email format is invalid')
      .required('Email is required'),
    password: Yup.string()
      .min(6, "Password must have at least 6 characters")
      .required("Password is required"),
  });

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      console.log('GitHub OAuth Error:', { error, errorDescription });
      let errorMessage = 'GitHub login was cancelled or failed';

      if (error === 'access_denied') {
        errorMessage = 'GitHub login was cancelled by user';
      } else if (errorDescription) {
        errorMessage = `GitHub error: ${errorDescription}`;
      }

      toast.error(errorMessage);
      setError({ form: errorMessage });

      // Clean up URL
      navigate('/login', { replace: true });
      return;
    }

    if (code) {
      console.log('GitHub authorization code received, processing...');
      handleGithubCallback(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, navigate]);

  // Add this debug function to check environment variables (remove in production)
  // useEffect(() => {
  //   console.log('Environment check:', {
  //     hasGithubClientId: !!GITHUB_CLIENT_ID,
  //     hasApiUrl: !!import.meta.env.VITE_REACT_APP,
  //     currentOrigin: getCurrentDomain(),
  //     redirectUri: REDIRECT_URI
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const handleGithubCallback = async (code) => {
    try {
      setIsGithubLoading(true);
      // console.log('GitHub Auth Code:', code);
      // console.log('Redirect URI used:', REDIRECT_URI);

      // Clear any existing errors
      setError({});

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP}/api/auth/github`,
        {
          code,
          redirect_uri: REDIRECT_URI
        },
        {
          timeout: 10000, // 10 second timeout
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      // console.log('GitHub login response:', response.data);

      const { token, userData } = response.data;

      if (response.status === 200 && token) {
        dispatch(addToken({ token }));
        toast.success(`Welcome ${userData.firstname}! GitHub Login Successful`);

        // Clean up URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);

        navigate('/', { replace: true });
      } else {
        throw new Error('Invalid GitHub login response');
      }
    } catch (error) {
      console.log('GitHub Login Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code
      });

      let errorMessage = 'GitHub login failed. Please try again.';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please check your internet connection and try again.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your connection.';
      }

      setError({ form: errorMessage });
      toast.error('GitHub login unsuccessful');

      // Clean up URL parameters on error
      window.history.replaceState({}, document.title, '/login');

    } finally {
      setIsGithubLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name !== 'password') {
      setUserLogin((prev) => ({ ...prev, [name]: value }));
      return;
    }

    const newChar = value[value.length - 1];

    if (value.length < realValue.length) {
      const updatedRealValue = realValue.slice(0, value.length);
      setRealValue(updatedRealValue);
      setUserLogin((prev) => ({ ...prev, password: updatedRealValue }));
      setDisplayValue('*'.repeat(updatedRealValue.length));
      return;
    }

    const updatedRealValue = realValue + newChar;
    setRealValue(updatedRealValue);
    setUserLogin((prev) => ({ ...prev, password: updatedRealValue }));

    const masked = '*'.repeat(updatedRealValue.length - 1) + newChar;
    setDisplayValue(masked);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDisplayValue('*'.repeat(updatedRealValue.length));
    }, 1000);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    setIsLoading(true);

    try {
      await LoginSchema.validate(userLogin, { abortEarly: false });
    } catch (error) {
      const validationErrors = {};
      error.inner.forEach((validationError) => {
        validationErrors[validationError.path] = validationError.message;
      });
      setError(validationErrors);
      setIsLoading(false);
      return;
    }

    if (!recaptcha) {
      setError({ recaptcha: 'Please complete the reCAPTCHA verification.' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP}/api/auth/signin`,
        {
          ...userLogin,
          recaptcha: recaptcha
        }
      );

      const { token } = response.data;

      if (response.status === 200 && token) {
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

      setRecaptcha(null);
      if (window.grecaptcha) {
        window.grecaptcha.reset();
      }
    } finally {
      setIsLoading(false);
    }
  };

  //Google login
  const handleGoogleSuccess = async (authResult) => {
    try {
      setIsGoogleLoading(true);
      // console.log('Google Auth Result:', authResult);

      if (authResult?.code) {
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP}/api/auth/google`,
          { code: authResult.code }
        );

        const { token } = response.data;

        if (!token) {
          toast.error('No token received from server.');
          setIsGoogleLoading(false);
          return;
        }

        dispatch(addToken({ token }));
        toast.success('Google Login Successful');

        setIsGoogleLoading(false);
      }
    } catch (error) {
      console.log('Google Login Error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Google login failed. Please try again.';

      setError({ form: errorMessage });
      toast.error('Google login unsuccessful');
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.log('Google OAuth Error:', error);
    setError({ form: 'Google login failed. Please try again.' });
    toast.error('Google login failed');
    setIsGoogleLoading(false);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    flow: 'auth-code',
  });

  const handleGithubLogin = () => {
    if (!GITHUB_CLIENT_ID) {
      toast.error('GitHub Client ID not configured');
      console.log('VITE_GITHUB_CLIENT_ID not found in environment variables');
      return;
    }

    // Clear any existing errors
    setError({});

    // console.log('GitHub OAuth URL:', GITHUB_OAUTH_URL);
    // console.log('Redirect URI:', REDIRECT_URI);
    // console.log('GitHub Client ID:', GITHUB_CLIENT_ID);

    try {
      setIsGithubLoading(true);
      window.location.href = GITHUB_OAUTH_URL;
    } catch (error) {
      console.log('Error redirecting to GitHub:', error);
      setIsGithubLoading(false);
      toast.error('Failed to redirect to GitHub. Please try again.');
    }
  };

  // Check if form is valid for button enable/disable
  const isFormValid = userLogin.email.trim() !== '' && userLogin.password.trim() !== '' && recaptcha;

  return (
    <>
      <div className="min-h-screen bg-white flex relative">
        {/* Left side */}
        <div className="hidden md:block md:w-1/2 fixed left-0 top-0 h-screen z-0">
          <img
            src='/Img/Login/login-image.png'
            alt="Login"
            className="object-cover w-full h-full"
          />

          <div className="absolute bottom-8 left-8 text-[5px] lg:text-2xl font-light max-w-md z-10 bg-gradient-to-r from-blue-400 to-blue-700 text-transparent bg-clip-text">
            keeping conversations alive and effortless.
          </div>
        </div>

        {/* Right side */}
        <div className="w-full md:w-1/2 md:ml-auto relative z-10 bg-white overflow-y-auto h-screen"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#0D41E1 #f1f1f1',
          }}>
          <style jsx>{`
            .login-scroll-container::-webkit-scrollbar {
              width: 4px;
              display: block !important;
            }
            .login-scroll-container::-webkit-scrollbar-track {
              background: transparent;
            }
            .login-scroll-container::-webkit-scrollbar-thumb {
              background: #2563eb;
              border-radius: 2px;
            }
            .login-scroll-container::-webkit-scrollbar-thumb:hover {
              background: #1d4ed8;
            }
          `}</style>
          <div className="mx-4 px-4  pt-20 sm:mx-6 sm:px-6 md:mx-8 md:px-8 lg:mx-12 lg:px-12 xl:mx-16 xl:px-16 min-h-screen flex flex-col justify-center login-scroll-container">
            {/* Mobile header image/text - only visible on mobile */}
            <div className="md:hidden mb-8 text-center">
              <div className="mb-4">
                <img
                  src="/Img/Login/login-image.png"
                  alt="Login"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <p className="text-lg font-light text-gray-700 max-w-sm mx-auto">
              </p>
            </div>

            {/* Title */}
            <div className={`flex flex-col text-gray-800 ${error.form ? 'mb-4' : 'mb-8'}`}>
              <p className="text-2xl sm:text-3xl font-bold mb-1">Welcome back!</p>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-base sm:text-lg">
                  Sign in to continue to
                </span>
                <span className="bg-gradient-to-r from-[#09A6F3] to-[#0C63E7] text-transparent bg-clip-text font-semibold">
                  VIBE TALK
                </span>
              </div>
            </div>

            {/* API error */}
            {error.form && (
              <div className=" mb-1.5 text-center text-red-500 bg-red-50 rounded-md border border-red-300 p-3 text-sm">
                {error.form}
              </div>
            )}

            {/* GitHub Processing State */}
            {isGithubLoading && (
              <div className=" mb-4 text-center text-blue-600 bg-blue-50 rounded-md border border-blue-300 p-3 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Processing GitHub login...
                </div>
              </div>
            )}

            {/* Google Processing State */}
            {isGoogleLoading && (
              <div className="mb-4 text-center text-green-600 bg-green-50 rounded-md border border-green-300 p-3 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  Processing Google login...
                </div>
              </div>
            )}

            {/* Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-semibold text-md mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700">
                      <FiMail className="text-base" />
                    </span>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter your email"
                      className="w-full p-3 pl-10 rounded-md border border-gray-300 text-black
                    focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-sm sm:text-base"
                      value={userLogin.email}
                      onChange={handleChange}
                      disabled={isLoading || isGoogleLoading || isGithubLoading}
                      required
                    />
                  </div>
                  {error.email && <p className="mt-1 text-xs text-red-500">{error.email}</p>}
                </div>

                {/* Password Field */}
                <div className="mb-6">
                  <label htmlFor="password" className="block text-gray-700 font-semibold text-md mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700">
                      <LuLockKeyhole className="text-base" />
                    </span>
                    <input
                      type="text"
                      name="password"
                      id="password"
                      placeholder="Enter your password"
                      className="w-full p-3 pl-10 pr-12 rounded-md border border-gray-300 text-black
                       focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-sm sm:text-base"
                      value={showPassword ? userLogin.password : displayValue}
                      onChange={handleChange}
                      disabled={isLoading || isGoogleLoading || isGithubLoading}
                      required
                    />

                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-blue-600"
                    >
                      {showPassword ? <IoEyeOffOutline className="text-xl" /> : <IoEyeOutline className="text-xl" />}
                    </span>
                  </div>
                  {error.password && <p className="mt-1 text-xs text-red-500">{error.password}</p>}
                </div>

                {/* reCAPTCHA */}
                <div className="mb-3">
                  <div className="flex justify-center sm:justify-start">
                    <ReCAPTCHA
                      sitekey="6LcBV50rAAAAABLix2LnNVEzcgBg4owV95_y-g0K"
                      onChange={getRecaptchavalue}
                      onExpired={onRecaptchaExpired}
                      onErrored={() => setError(prev => ({ ...prev, recaptcha: 'reCAPTCHA error occurred. Please try again.' }))}
                      size={window.innerWidth < 640 ? 'compact' : 'normal'}
                    />
                  </div>
                  {error.recaptcha && <p className="mt-1 text-xs text-red-500">{error.recaptcha}</p>}
                </div>

                {/* Forgot Password */}
                <div className="flex justify-start mb-4">
                  <Link
                    to="/forget-password"
                    // state={{ email: userLogin.email }}
                    className="text-[15px] bg-gradient-to-r from-[#09A6F3] to-[#0C63E7] text-transparent bg-clip-text font-semibold hover:underline"
                  >
                    Forgot password
                    <span className='ml-1'>?</span>
                  </Link>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={!isFormValid || isLoading || isGoogleLoading || isGithubLoading}
                  className={`w-full p-3 rounded-md text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all ${!isFormValid || isLoading || isGoogleLoading || isGithubLoading
                    ? 'bg-gradient-to-r from-[#0D41E1] via-[#0A85ED] to-[#07C8F9] hover:from-[#0C63E7] hover:via-[#0A85ED] hover:to-[#09A6F3]  shadow-lg hover:shadow-xl cursor-not-allowed '
                    : 'bg-gradient-to-r from-[#0D41E1] via-[#0A85ED] to-[#07C8F9] hover:from-[#0C63E7] hover:via-[#0A85ED] hover:to-[#09A6F3] cursor-pointer shadow-lg hover:shadow-xl'
                    }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <PiSignIn className="text-xl" />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center my-6">
                  <div className="flex-grow border-t border-[#0D41E1]"></div>
                  <span className="px-3 text-sm bg-gradient-to-r from-[#1E90FF] to-[#3799FA] bg-clip-text text-transparent whitespace-nowrap">
                    Or login with
                  </span>
                  <div className="flex-grow border-t border-[#0D41E1]"></div>
                </div>

                {/* Social Login Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Google Button */}
                  <button
                    type="button"
                    className={`flex-1 flex items-center justify-center gap-3 px-4.5 py-2 border border-gray-300 rounded-md text-[16px] transition-all ${isGoogleLoading || isLoading || isGithubLoading
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer hover:bg-gray-50 hover:shadow-md'
                      }`}
                    onClick={googleLogin}
                    disabled={isGoogleLoading || isLoading || isGithubLoading}
                  >
                    {isGoogleLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    ) : (
                      <img
                        src="https://www.svgrepo.com/show/355037/google.svg"
                        className="h-5 w-5"
                        alt="Google"
                      />
                    )}
                    {isGoogleLoading ? 'Signing In...' : 'Google'}
                  </button>

                  {/* GitHub Button */}
                  <button
                    type="button"
                    className={`flex-1 flex items-center justify-center gap-3 px-4.5 py-2 border border-gray-300 rounded-md text-[16px] transition-all ${isGithubLoading || isLoading || isGoogleLoading
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer hover:bg-gray-50 hover:shadow-md'
                      }`}
                    onClick={handleGithubLogin}
                    disabled={isGithubLoading || isLoading || isGoogleLoading}
                  >
                    {isGithubLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    ) : (
                      <img
                        src="https://www.svgrepo.com/show/512317/github-142.svg"
                        className="h-5 w-5"
                        alt="GitHub"
                      />
                    )}
                    {isGithubLoading ? 'Signing In...' : 'GitHub'}
                  </button>
                </div>
              </form>
            </div>

            {/* Register Link */}
            <div className="mt-5 md-5 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#0C63E7] font-semibold hover:underline">
                  SignUp
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8  text-center text-gray-500 leading-relaxed">
              <div className="mb-2 text-[14px]">© 2025 Releasium Inc. All rights reserved.</div>
              <div className="flex flex-wrap justify-center gap-1.5">
                <Link to="#" className="hover:underline text-[13.5px] font-semibold text-[#bb5b5b]">Privacy Policy</Link>
                <span>||</span>
                <Link to="#" className="hover:underline text-[13.5px] font-semibold text-[#bb5b5b]">Terms & Conditions</Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Login;