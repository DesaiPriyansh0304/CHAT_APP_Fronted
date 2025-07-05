import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';

function ResetPassword() {
    const { state } = useLocation();
    const email = state?.email || '';
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [expiryTime, setExpiryTime] = useState(180); // 3 minutes
    const navigate = useNavigate();

    // Countdown timer
    useEffect(() => {
        if (expiryTime <= 0) return;
        const interval = setInterval(() => {
            setExpiryTime(prev => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [expiryTime]);

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handleResendOtp = async () => {
        setResending(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_REACT_APP}/api/auth/forgotPassword`, {
                email,
            });
            toast.success(res.data.message || "OTP resent");
            setExpiryTime(300);
        } catch (error) {
            toast.error(error.response?.data?.message || "Resend failed");
        } finally {
            setResending(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_REACT_APP}/api/auth/resetPassword`, {
                email,
                otp,
                newPassword,
            });
            toast.success(res.data.message);
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#213448] text-white flex justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="bg-[#2b3e50] p-8 rounded shadow-md w-full max-w-md"
            >
                <h2 className="text-xl font-semibold mb-4">Reset Password</h2>

                <input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full p-3 mb-3 rounded text-white"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />



                <input
                    type="password"
                    placeholder="New Password"
                    className="w-full p-3 mb-3 rounded text-white"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full p-3 mb-4 rounded text-whitex"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-semibold mb-2"
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </div>

                {/* Countdown + Resend OTP */}
                < div className="flex justify-between items-center mt-1 mb-4" >
                    <div>
                        <p className="text-sm text-yellow-400">
                            Expires: <span className="font-semibold">{formatTime(expiryTime)}</span>
                        </p>
                    </div>



                    <div>
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
                </div>
            </form >
        </div >
    );
}

export default ResetPassword;
