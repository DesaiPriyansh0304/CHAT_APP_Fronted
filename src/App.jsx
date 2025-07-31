import React from 'react';
import './App.css';
//Main Router
import AppRouter from '../Router/AppRouter';
import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {
  return (
    <>
      <GoogleOAuthProvider clientId="661327388232-u078e0hg2je11uj5vb4h9t55jp8ti0eo.apps.googleusercontent.com">
        <AppRouter />
      </GoogleOAuthProvider>
    </>
  );
}

export default App;