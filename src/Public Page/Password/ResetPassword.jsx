import React, { useState, useEffect, useRef } from 'react';
import { Check, X, Eye, EyeOff, Loader2, Copy } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineLockReset } from "react-icons/md";
import { LuLockKeyhole } from 'react-icons/lu';
import { FiLoader } from 'react-icons/fi';
import { MdKey } from "react-icons/md";
import axios from 'axios';
import toast from 'react-hot-toast';

function ResetPassword() {

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;     // Email Id

  const [otpValues, setOtpValues] = useState(Array(6).fill(''));          //OTP value
  const [otp, setOtp] = useState('');                                     //OTP
  const [newPassword, setNewPassword] = useState('');                     //New Password
  const [confirmPassword, setConfirmPassword] = useState('');             //Confirm New Password
  const [showNewPassword, setShowNewPassword] = useState(false);          //show New passworrd
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);  // show in confirm password
  const [loading, setLoading] = useState(false);                          //loading
  const [resending, setResending] = useState(false);                      //resnt otp 
  const [expiryTime, setExpiryTime] = useState(180);                      //Expiry Time            
  const [warning, setWarning] = useState(false);                          //Email warning      
  const inputRefs = useRef([]);



  //Password Validation
  const [passwordValidation, setPasswordValidation] = useState({
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumber: false,
    hasMinLength: false,
    hasSpecialChar: false,
  });

  // otp expiry time from localStorage or initialize
  useEffect(() => {
    if (!email) return;

    const savedExpiry = localStorage.getItem('otpExpiresAt');
    const expiredFlag = localStorage.getItem('otpExpired');

    if (expiredFlag === 'true') {
      setExpiryTime(0);
      return;
    }

    if (savedExpiry) {
      const remaining = Math.floor((Number(savedExpiry) - Date.now()) / 1000);
      if (remaining > 0) {
        setExpiryTime(remaining);
      } else {
        setExpiryTime(0);
        localStorage.setItem('otpExpired', 'true');
      }
    } else {
      const expiresAt = Date.now() + 180 * 1000;
      localStorage.setItem('otpExpiresAt', expiresAt);
      setExpiryTime(180);
    }
  }, [email]);

  // Timer countdown
  useEffect(() => {
    if (!email || expiryTime <= 0) return;

    const interval = setInterval(() => {
      setExpiryTime((prev) => {
        const newVal = prev - 1;
        if (newVal <= 0) {
          localStorage.removeItem('otpExpiresAt');
          localStorage.setItem('otpExpired', 'true');  // ⬅️ Add this
        }
        return newVal;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime, email]);

  // Password validation
  useEffect(() => {
    setPasswordValidation({
      hasLowerCase: /[a-z]/.test(newPassword),
      hasUpperCase: /[A-Z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*()_]/.test(newPassword),
      hasMinLength: newPassword.length >= 8,
    });
  }, [newPassword]);

  // Navigate warning email chake
  useEffect(() => {
    if (!email) {
      setWarning(true);
      setTimeout(() => {
        navigate('/forgot-password');
      }, 2500);
    }
  }, [email, navigate]);


  //convert in otp array value
  useEffect(() => {
    setOtp(otpValues.join(''));
  }, [otpValues]);

  //format time function
  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  {/* Ensures only numeric input using regex function*/ }
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  {/*keybord Event*/ }
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otpValues[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtpValues = [...otpValues];
        newOtpValues[index] = '';
        setOtpValues(newOtpValues);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  {/*resend-otp API call*/ }
  const handleResendOtp = async () => {
    setResending(true);
    try {
      await axios.post(`${import.meta.env.VITE_REACT_APP}/api/otp/resend-otp`, { email });

      // Reset localStorage flags
      const expiresAt = Date.now() + 180 * 1000;
      localStorage.setItem('otpExpiresAt', expiresAt);
      localStorage.removeItem('otpExpired');

      setExpiryTime(180);
      setOtpValues(Array(6).fill(''));
      inputRefs.current[0]?.focus();
      toast.success('OTP resent successfully');
    } catch (error) {
      console.log('error --->resend-otp/ResetPassword', error);
      toast.error("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };


  {/*resend password api call*/ }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("Please enter full 6-digit OTP");
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');

    const { hasLowerCase, hasUpperCase, hasNumber, hasMinLength } = passwordValidation;
    if (!hasLowerCase || !hasUpperCase || !hasNumber || !hasMinLength)
      return toast.error('Password does not meet requirements');

    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_REACT_APP}/api/auth/password/resetPassword`, {
        email, otp, newPassword,
      });
      toast.success(res.data.message || 'Password reset successful!');
      navigate('/login');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Password reset failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  {/*Copy function*/ }
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Password copied!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  {/*validatoion password text*/ }
  const ValidationItem = ({ isValid, text }) => (
    <div className={`flex items-center  gap-2  text-sm
      ${isValid ? 'text-green-400' : 'text-gray-400'}
    `}>
      {isValid ? <Check size={16} /> : <X size={16} />}
      <span>{text}</span>
    </div>
  );

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (!/^\d*$/.test(pasteData)) return; // only numbers allow

    const digits = pasteData.split('').slice(0, 6);
    const newOtpValues = [...otpValues];

    digits.forEach((digit, idx) => {
      newOtpValues[idx] = digit;
    });

    setOtpValues(newOtpValues);

    // focus next empty field
    const firstEmptyIndex = newOtpValues.findIndex((val) => val === '');
    if (firstEmptyIndex !== -1) {
      inputRefs.current[firstEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.blur();
    }
  };


  return (
    <div className="min-h-screen bg-[#1F2937] flex justify-center items-center p-4">

      {/* Close Button */}
      <div>
        <button className="absolute top-3 right-3 text-white text-2xl z-10 cursor-pointer hover:text-gray-300
          disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => {
            localStorage.removeItem('otpExpiresAt');
            navigate('/forget-password');
          }}
          disabled={loading || resending}
        >
          <X size={24} />
        </button>
      </div>

      <div className='relative w-full max-w-md rounded-lg p-8 pt-12'>

        {/*title icon*/}
        <div className=" w-16 h-16 mb-6 text-4xl flex items-center justify-center mx-auto rounded-full
           bg-[#252B4D]  text-indigo-400">
          <MdOutlineLockReset />
        </div>
        {/*title*/}
        <h2 className="text-white text-2xl font-semibold mb-1 text-center">Reset Password</h2>
        <p className="text-gray-400 text-sm mb-6">
          Enter the code sent to <span className='text-blue-400 font-semibold'>{email}</span> and choose a new password.
        </p>

        {/*warning email*/}
        <div>
          {warning && (
            <div className="p-2.5 mb-4 bg-[#38302B] text-[#FAAF25] border border-[#4F3822] rounded-xl">
              Please enter your email address in the form first.
            </div>
          )}
        </div>

        {/*form data*/}
        <div className='flex justify-center'>
          <form onSubmit={handleSubmit}>

            {/*Otp input*/}
            <div className="gap-1 mb-5 mx-[15px]">
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
                  onPaste={handlePaste}
                  className="w-10 h-12 text-center mx-2  rounded-xl text-lg
                   border-gray-500 border-2 bg-gray-800 text-white "
                />
              ))}
            </div>

            <hr className=" mt-2 mb-5  mx-[18px] border-t-2 border-[#0077b6] " />

            {/* New Password */}
            <div className="relative mb-3">
              {/*icon*/}
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
                <MdKey className='mt-[1px]' />
              </span>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter New Password"
                className="w-full pl-10 pr-10 py-3 rounded-md
                  bg-[#1F2F50] border border-[#7D95FB] text-white focus:outline-none focus:ring-2 focus:ring-blue-600
                  placeholder:text-white"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-white cursor-pointer">
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <button type="button"
                onClick={() => copyToClipboard(newPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer">
                <Copy size={18} />
              </button>
            </div>

            {/*Show in password petten*/}
            {newPassword && (
              <div className="bg-gray-800/50 p-3 rounded-lg mb-3 text-left space-y-1">
                <p className='text-white font-semibold'>Make sure your password is strong.</p>
                <ValidationItem isValid={passwordValidation.hasMinLength} text="Minimum 8 characters" />
                <ValidationItem isValid={passwordValidation.hasLowerCase} text="At least one lowercase letter" />
                <ValidationItem isValid={passwordValidation.hasUpperCase} text="At least one uppercase letter" />
                <ValidationItem isValid={passwordValidation.hasSpecialChar} text="At least one special character" />
                <ValidationItem isValid={passwordValidation.hasNumber} text="At least one number" />
              </div>
            )}

            {/* Confirm Password */}
            <div className="relative mb-4 mt-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
                <MdKey className='mt-[1px]' />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                className={`w-full p-3 pl-10 pr-10 rounded-md
                 bg-[#1F2F50] border border-[#7D95FB] text-white focus:outline-none focus:ring-2 focus:ring-blue-600
                 placeholder:text-white
                  ${confirmPassword && newPassword !== confirmPassword ? 'border-red-500 focus:ring-red-600 focus:ring-2' : ''}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-white cursor-pointer">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <button type="button"
                onClick={() => copyToClipboard(confirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer">
                <Copy size={18} />
              </button>
            </div>

            {/*warning in confirm password*/}
            <div>
              {confirmPassword && (
                <div className={`text-sm mb-2 ${newPassword === confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                  {newPassword === confirmPassword ? '✓ Passwords match' : 'Passwords do not match'}
                </div>
              )}
            </div>


            {/*Reset Password button*/}
            <div>
              <button
                type="submit"
                className="w-full p-3 rounded-md font-semibold mb-3 text-[16px]
                   bg-gradient-to-r from-[#0D41E1] via-[#0A85ED] to-[#07C8F9] text-white    
                   disabled:bg-gray-600 disabled:cursor-not-allowed cursor-pointer"
                disabled={
                  loading ||
                  otp.length !== 6 ||
                  newPassword !== confirmPassword
                }
              >
                {loading ? (
                  <div className="flex flex-row items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    <span className='text-[16px]'>Resetting...</span>
                  </div>
                ) : 'Save and Change'}
              </button>
            </div>

          </form>
        </div>

        {/*resent code*/}
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


        {/*cancel and expiry time*/}
        <div className={`mt-5 mx-[8px] ${email ? 'flex justify-between' : 'cursor-not-allowed'}`}>

          <div >
            <button onClick={() => {
              localStorage.removeItem('otpExpiresAt');
              navigate('/forget-password');
            }}
              disabled={loading || resending}
              className={`${!email ? 'w-full justify-center' : 'px-15'}
                  py-3 px-20 rounded-2xl text-[15px] bg-gradient-to-r from-[#343a40] via-[#495057] to-[#6c757d] text-[#f8f9fa]  
                  hover:from-[#495057] hover:via-[#6c757d] hover:to-[#adb5bd]         
                  font-semibold transition cursor-pointer
                  disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              Cancel
            </button>
          </div>

          <div className=''>
            {email && (
              <div>
                {expiryTime > 0 ? (
                  <div>
                    <p className="py-3  mr-[11px] bg-gradient-to-r from-[#F4F269] via-[#CEE26B] to-[#A8D26D] bg-clip-text text-transparent">
                      Expires in: <span className="font-semibold">{formatTime(expiryTime)}</span>
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[#ef233c] mt-[4px] font-bold mr-[11px] py-2">OTP Expired</p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
