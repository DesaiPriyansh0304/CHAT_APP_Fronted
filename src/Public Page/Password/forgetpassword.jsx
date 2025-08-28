import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import { FiMail } from "react-icons/fi";
import * as Yup from 'yup';

function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [showEmailInput, setShowEmailInput] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Email validation schema
  const emailSchema = Yup.object().shape({
    email: Yup.string()
      .matches(/\S+@\S+\.\S+/, 'Email format is invalid')
      .required('Email is required'),
  });

  // Check if email is passed from login page
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      setShowEmailInput(false);
    } else {
      setShowEmailInput(true);
    }
  }, [location.state]);

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear email error when user starts typing
    if (error.email) {
      setError(prev => ({ ...prev, email: null }));
    }
    // Clear form error when user changes email
    if (error.form) {
      setError(prev => ({ ...prev, form: null }));
    }
  };

  // Forget password API call
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setError({});

    // Validate email
    try {
      await emailSchema.validate({ email }, { abortEarly: false });
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((validationError) => {
        validationErrors[validationError.path] = validationError.message;
      });
      setError(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_REACT_APP}/api/auth/password/forgotPassword`, {
        email,
      });

      toast.success(res.data.message || 'OTP sent successfully!');
      navigate('/reset-password', { state: { email } }); // pass email to next page
    } catch (error) {
      console.log('Forget Password Error:', error);

      // Handle different types of errors
      let errorMessage = 'Something went wrong. Please try again.';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError({ form: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#1F2937] flex items-center justify-center p-4">
      {/* Cross Icon */}
      <div>
        <button
          className="absolute top-3 right-3 text-white text-2xl z-10 cursor-pointer
                    disabled:opacity-40 disabled:cursor-not-allowed hover:text-gray-300 transition-colors"
          onClick={() => navigate(-1)}
          disabled={loading}
          title="Go back"
        >
          <RxCross2 />
        </button>
      </div>

      <div className="relative w-full max-w-md rounded-lg p-8 pt-12 text-center">
        {/* Mail Icon */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-[#252B4D] mb-6 text-3xl text-indigo-400">
          <FiMail />
        </div>

        {/* Title & Subtitle */}
        <div className="flex justify-center items-center">
          <h2 className="text-white text-2xl font-semibold mb-1">Forget Password</h2>
          <span className="ml-1 text-white text-2xl font-semibold mb-1">?</span>
        </div>
        <p className="text-gray-400 text-sm mb-6">We'll send password reset instructions to your email</p>

        {/* Error Display */}
        {error.form && (
          <div className="bg-[#3F2937] text-[#F87171] border border-[#7F1D1D] py-3 px-4 mb-4 rounded-xl text-sm">
            {error.form}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input Field - Show when no email passed or user wants to change */}
          {showEmailInput && (
            <div className="mb-6">
              <label htmlFor="email" className="block text-white font-medium text-sm mb-2 text-left">
                Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400">
                  <FiMail className="text-base" />
                </span>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email address"
                  className="w-full p-3 pl-10 rounded-md border border-indigo-400 bg-[#212c3f] text-white 
                     text-md outline-none"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={loading}
                  required
                />
              </div>
              {error.email && <p className="mt-1 text-xs text-red-400 text-left">{error.email}</p>}
            </div>
          )}

          {/* Email Display - Show when email is passed from login */}
          {!showEmailInput && email && (
            <div className="mb-6">
              <div className="bg-[#1F2F50] text-[#d7e3fc] border border-[#003f88] py-4 px-4 mb-4 rounded-2xl text-sm">
                Instructions will be sent to:&nbsp;
                <span className="font-semibold text-[#60A5FA] underline underline-offset-4">
                  {email}
                </span>
              </div>

              {/* Option to change email */}
              <div className="text-center mb-4">
                <button
                  type="button"
                  onClick={() => setShowEmailInput(true)}
                  className="text-[#60A5FA] text-sm hover:underline transition-colors"
                  disabled={loading}
                >
                  Use different email address?
                </button>
              </div>
            </div>
          )}



          {/* Action Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              type="button"
              onClick={() => navigate('/login')}
              disabled={loading}
              className="flex-1 py-3 rounded-2xl bg-gray-700 text-white hover:bg-gray-600 transition-colors
                disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#0D41E1] via-[#0A85ED] to-[#07C8F9] text-white font-semibold 
                transition-opacity disabled:cursor-not-allowed cursor-pointer
                flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </div>
        </form>

        {/* Back to Login */}
        <div className='flex justify-center items-center mt-6 gap-2'>
          <p className='text-white text-sm'>Remember password?</p>
          <Link
            to="/login"
            className='text-[#60A5FA] text-sm font-semibold hover:underline transition-colors'
          >
            Login
          </Link>
        </div>

        {/* Additional Help */}
        <div className='mt-4 text-center'>
          <p className='text-gray-400 text-xs'>
            Didn't receive the email? Check your spam folder or try again.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;