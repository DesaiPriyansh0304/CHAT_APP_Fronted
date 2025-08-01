import React from 'react';
import './App.css';
//Main Router
import AppRouter from '../Router/AppRouter';
import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {

  //client ID
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    console.log('Google Client ID not found in environment variables: ', googleClientId);
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