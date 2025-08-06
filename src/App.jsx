import React from 'react';
import './App.css';
//Main Router
import AppRouter from './Pages/Router/AppRouter';
import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {

  //client ID /Google
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    // console.log('Google Client ID not found in environment variables: ', googleClientId);
    return (
      <div className='w-full h-screen flex justify-center mt-5 '>
        <h3 className='text-2xl text-center text-red-500'>
          Configuration Error: Missing Google Client ID
        </h3>
      </div>

    );
  }

  return (
    <>
      <GoogleOAuthProvider clientId={googleClientId}>
        <AppRouter />
      </GoogleOAuthProvider>
    </>
  );
}

export default App;