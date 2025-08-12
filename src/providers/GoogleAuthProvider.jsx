import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GoogleAuthProvider = ({ children }) => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!googleClientId) {
        return (
            <>
                <div className='w-screen h-screen flex justify-center mt-16'>
                    <h3 className='text-2xl text-center text-red-500'>
                        Configuration Error: Missing Google Client ID
                    </h3>
                </div>
            </>
        );
    }

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            {children}
        </GoogleOAuthProvider>
    );
};

export default GoogleAuthProvider;
