import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import { FiMail } from "react-icons/fi";


function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(false);
  console.log('warning --->/forget password', warning);

  const navigate = useNavigate();
  const location = useLocation();

  {/*email chake*/ }
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      setWarning(false);
    } else {
      setWarning(true);
    }
  }, [location.state]);

  {/*forget-password api call*/ }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_REACT_APP}/api/auth/password/forgotPassword`, {
        email,
      });
      toast.success(res.data.message);
      navigate('/reset-password', { state: { email } }); // pass email to next page
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
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
                    disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          <RxCross2 />
        </button>
      </div>

      <div className="relative w-full max-w-md rounded-lg p-8 pt-12 text-center ">
        {/* Mail Icon */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-[#252B4D] mb-6 text-3xl text-indigo-400">
          <FiMail />
        </div>






        {/* Title & Subtitle */}
        <h2 className="text-white text-2xl font-semibold mb-1">Forget Password</h2>
        <p className="text-gray-400 text-sm mb-6">We'll send password reset instructions to your email</p>

        {/* Info or Warning Box */}
        <div className=''>
          {email ? (
            <div className="bg-[#1F2F50] text-[#d7e3fc] border border-[#003f88] py-4 px-4 mb-6 rounded-2xl text-sm">
              Instructions will be sent to:&nbsp;
              <span className="font-semibold text-[#60A5FA] underline underline-offset-4">
                {email}
              </span>
            </div>
          ) : (
            <div className="bg-[#38302B] text-[#FAAF25] border border-[#4F3822] p-3 mb-6 rounded-xl text-sm">
              Please enter your email address in the form first.
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Action Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              className="flex-1 py-3 rounded-2xl bg-gray-700 text-white hover:bg-gray-600 transition
              disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !email}
              className="flex-1 py-3 rounded-2xl  bg-gradient-to-r from-[#0D41E1] via-[#0A85ED] to-[#07C8F9] text-white   font-semibold 
                    hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed  cursor-pointer"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;