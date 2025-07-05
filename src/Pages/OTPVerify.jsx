import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiLoader } from 'react-icons/fi';

function OtpVerify() {
    const [otp, setOtp] = useState('');
    const [resending, setResending] = useState(false);
    const [expiryTime, setExpiryTime] = useState(180); // 3 minutes
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setExpiryTime(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (expiryTime === 0) {
            toast.error("OTP expired. Please request a new one.");
            return;
        }

        try {
            const res = await axios.post(`${import.meta.env.VITE_REACT_APP}/api/otp/verify-otp`, {
                email,
                otp,
            });

            if (res.status === 200) {
                toast.success('OTP Verified Successfully!');
                navigate('/');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid OTP');
        }
    };

    const handleResendOtp = async () => {
        try {
            setResending(true);
            const res = await axios.post(`${import.meta.env.VITE_REACT_APP}/api/otp/resend-otp`, {
                email,
            });

            if (res.data?.success) {
                toast.success('OTP resent to your email');
                setExpiryTime(180); // Reset timer
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
        <div className="min-h-screen flex items-center justify-center bg-[#213448] text-white">
            <form onSubmit={handleVerify} className="bg-gray-900 p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl mb-4 font-semibold">Verify OTP</h2>
                <p className="text-sm mb-4">Enter the OTP sent to your email.</p>

                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full p-3 text-white rounded mb-4 bg-gray-800"
                />

                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-semibold mb-2"
                >
                    Verify OTP
                </button>

                <div className="flex justify-between items-center mt-3">
                    {/* Countdown Timer */}
                    <p className="text-sm text-yellow-400">
                        Expires: <span className="font-semibold">{formatTime(expiryTime)}</span>
                    </p>

                    {/* Resend OTP Button */}
                    <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resending}
                        className="text-blue-400 hover:text-blue-500 text-sm font-medium flex items-center gap-2"
                    >
                        {resending && <FiLoader className="animate-spin" size={16} />}
                        {resending ? 'Resending...' : 'Resend OTP'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default OtpVerify;
