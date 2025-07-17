import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import './App.css';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from "./Pages/PrivetRouter";
import PublicRoute from "./Pages/PublicRouter";
import OtpVerify from "./Pages/OTPVerify";
import ForgetPassword from "./Pages/forgetpassword";
import ResetPassword from "./Pages/ResetPassword";
import { useSelector } from "react-redux";

function App() {


  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="w-screen h-screen">
      <Toaster />
      <Routes>
        {/* Private routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/contact/:token" element={<Home />} />
          <Route path="/:tab" element={<Home />} />
        </Route>

        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp-verify" element={<OtpVerify />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
