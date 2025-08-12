import React from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
//Main Router
import AppRouter from './Router/AppRouter';
//GoogleAuthProvider
import GoogleAuthProvider from './providers/GoogleAuthProvider';

function App() {
  return (
    <>
      <Router>
        <GoogleAuthProvider>
          <AppRouter />
        </GoogleAuthProvider>
      </Router>
    </>
  );
}

export default App;