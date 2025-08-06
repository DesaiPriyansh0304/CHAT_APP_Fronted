import React from 'react';
import { useNavigate } from 'react-router-dom';

function ErrorPage() {
    const navigate = useNavigate();

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-md">
                <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
                <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
                <p className="text-gray-600 mb-6">
                    You don't have permission to access this page.
                </p>
                <button
                    onClick={handleBackToLogin}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
}

export default ErrorPage;
