import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import './App.css';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from "./Pages/RouterPage/PrivetRouter";
import PublicRoute from "./Pages/RouterPage/PublicRouter";
import OtpVerify from "./Pages/OTPVerify";
import ForgetPassword from "./Pages/forgetpassword";
import ResetPassword from "./Pages/ResetPassword";
import { useSelector } from "react-redux";


function App() {

  {/*Theme Slice*/ }
  const theme = useSelector((state) => state.theme.mode);

  {/*change value in theme*/ }
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <>
      <div className="w-screen h-screen">
        <Toaster />
        <Routes>

          {/* 🔐----------------- Private routes ------------------ */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />                          {/*main router*/}
            <Route path="/contact/:token" element={<Home />} />            {/*contact verifiction router/token*/}
            <Route path="/:tab" element={<Home />} />                      {/*all icon router*/}
          </Route>

          {/* 🆓----------------- Public routes ------------------ */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />                     {/*login router*/}
            <Route path="/register" element={<Register />} />               {/*register router*/}
            <Route path="/otp-verify" element={<OtpVerify />} />            {/*otp-verify router*/}
            <Route path="/forget-password" element={<ForgetPassword />} />  {/*forget-password router*/}
            <Route path="/reset-password" element={<ResetPassword />} />    {/*reset-password router*/}
          </Route>

        </Routes>
      </div>
    </>
  );
}

export default App;
