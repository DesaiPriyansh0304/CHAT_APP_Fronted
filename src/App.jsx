import React from 'react';
import './App.css';
//Main Router
import AppRouter from '../Router/AppRouter';
import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {
  // Get client ID from environment variable
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    console.error('Google Client ID not found in environment variables');
    return <div>Configuration Error: Missing Google Client ID</div>;
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