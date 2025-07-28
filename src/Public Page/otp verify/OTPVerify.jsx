import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiLoader } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';

function OtpVerify() {
  const [otpValues, setOtpValues] = useState(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [expiryTime, setExpiryTime] = useState(180);
  const [warning, setWarning] = useState(false);
  const inputRefs = useRef([]);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Countdown Timer
  useEffect(() => {
    let timer;
    if (expiryTime > 0) {
      timer = setInterval(() => {
        setExpiryTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [expiryTime]);

  useEffect(() => {
    if (!email) {
      setWarning(true);
    }
  }, [email]);

  {/*forment expired*/ }
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  {/*otp validation*/ }
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (!value) return;

    const newOtp = [...otpValues];
    newOtp[index] = value.charAt(value.length - 1);
    setOtpValues(newOtp);
    setOtpError('');

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  {/*Key bord Event*/ }
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otpValues];
      if (otpValues[index]) {
        newOtp[index] = '';
        setOtpValues(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        newOtp[index - 1] = '';
        setOtpValues(newOtp);
      }
    }
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const otp = otpValues.join('');
    setOtpError('');

    if (otp.length !== 6) {
      setOtpError('Please enter the full 6-digit OTP');
      return;
    }

    if (expiryTime === 0) {
      toast.error('OTP expired. Please request a new one.');
      return;
    }

    try {
      setIsVerifying(true);
      const res = await axios.post(`${import.meta.env.VITE_REACT_APP}/api/otp/verify-otp`, {
        email,
        otp,
      });

      if (res.status === 200) {
        toast.success('OTP Verified Successfully!');
        navigate('/');
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Invalid OTP entered');
    } finally {
      setIsVerifying(false);
      setOtpValues(Array(6).fill(''));
      inputRefs.current[0]?.focus();
    }
  };


  {/*resnt-opt APi call*/ }
  const handleResendOtp = async () => {
    try {
      setResending(true);
      const res = await axios.post(`${import.meta.env.VITE_REACT_APP}/api/otp/resend-otp`, {
        email,
      });

      if (res.data?.success) {
        toast.success('OTP resent to your email.');
        setExpiryTime(180);
        setOtpValues(Array(6).fill(''));
        inputRefs.current[0]?.focus();
      } else {
        toast.error('Something went wrong while resending OTP');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1F2937] relative">

      {/* Close Button */}
      <div>
        <button
          className="absolute top-3 right-3 text-white text-2xl z-10 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => navigate(-1)}
          disabled={isVerifying || resending}
        >
          <RxCross2 />
        </button>
      </div>

      <div className="w-full max-w-md rounded-lg p-8 pt-12">
        <form onSubmit={handleVerify}>
          <h2 className="text-2xl mb-4 font-semibold text-center text-white">Verify OTP</h2>
          <p className="text-sm mb-6 text-gray-400">Enter the 6-digit code sent to your email. This code is valid for 3 minutes.</p>

          {/* Email Instruction */}
          {email ? (
            <div className="bg-[#1F2F50] text-[#60a5fa] py-4 px-4 mb-6 rounded-2xl text-sm">
              Instructions were sent to: <span className="font-semibold text-[#60A5FA]">{email}</span>
            </div>
          ) : warning && (
            <div className="bg-[#38302B] text-[#FAAF25] border border-[#4F3822] p-2.5 mb-4 rounded-xl">
              Please enter your email address in the form first.
            </div>
          )}

          {/* OTP Input Fields */}
          <div className="flex justify-between gap-1 mb-3 mx-[20px]">
            {otpValues.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-12 text-center rounded-xl border-2 border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-white text-lg"
              />
            ))}
          </div>

          {/* OTP Error */}
          <div className='ml-[12px]'>
            {otpError && (
              <p className="text-red-400 text-sm mb-4">{otpError}</p>
            )}
          </div>

          <hr className=" mt-2 mb-3.5 mx-[16px] border-t-2 border-[#0077b6] " />

          {/* Submit Button */}
          <div className='mx-[12px]'>
            <button
              type="submit"
              className="w-full bg-gradient-to-r text-[18px] from-[#0D41E1] via-[#0A85ED] to-[#07C8F9] text-white hover:opacity-90 transition p-2.5 rounded-xl 
            font-semibold mb-2 cursor-pointer"
              disabled={isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Verify'}
            </button>
          </div>

          {/* Resend OTP */}
          <div className="flex justify-center mt-3">
            <div>
              <span className="text-white">Didn't get the code?&nbsp;</span>
            </div>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending || !email || expiryTime > 0}
              className={`flex items-center gap-1 text-[#078bf7] font-semibold ${expiryTime <= 0 ? 'cursor-pointer' : 'cursor-not-allowed'} `}
            >
              {resending && <FiLoader className="animate-spin" size={16} />}
              {resending ? 'Resending...' : 'Resend code'}
            </button>
          </div>


          {/* Cancel Button + Timer */}
          <div className={`mt-3 text-sm ${email ? 'flex justify-between' : ''}`}>

            <div className={`${!email ? 'mx-[12px]' : ''}`}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isVerifying || resending}
                className={`${!email ? 'w-full justify-center ' : 'px-15'
                  } py-3 rounded-2xl
                  bg-gradient-to-r from-[#343a40] via-[#495057] to-[#6c757d] text-[#f8f9fa]  text-[15px] 
                   hover:from-[#495057] hover:via-[#6c757d] hover:to-[#adb5bd] 
                   font-semibold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                Cancel
              </button>
            </div>

            {email && expiryTime > 0 ? (
              <p className="py-2 bg-gradient-to-r from-[#F4F269] via-[#CEE26B] to-[#A8D26D] bg-clip-text text-transparent">
                Expires in: <span className="font-semibold">{formatTime(expiryTime)}</span>
              </p>
            ) : email && expiryTime === 0 ? (
              <p className="text-red-400 font-semibold py-2">OTP code has expired</p>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}

export default OtpVerify;
