import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initializeTheme } from './feature/Slice/Theme/ThemeSlice';
//Main Router
import AppRouter from './Router/AppRouter';
//GoogleAuthProvider
import GoogleAuthProvider from './providers/GoogleAuthProvider';

function App() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  // Initialize theme on app mount
  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  // Ensure theme is applied correctly
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <>
      <GoogleAuthProvider>
        <Router>
          <AppRouter />
        </Router>
      </GoogleAuthProvider>
    </>
  );
}

export default App;