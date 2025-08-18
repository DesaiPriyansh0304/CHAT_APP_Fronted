import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Route Guards
import PrivateRoute from '../Public Page/RouterPage/PrivateRouter';
import PublicRoute from '../Public Page/RouterPage/PublicRouter';
// Private Pages
import Home from '../Pages/Home';
// Public Pages
import Login from '../Public Page/SignIn-SignUP/Login';
import Register from '../Public Page/SignIn-SignUP/Register';
import OtpVerify from '../Public Page/otp verify/OTPVerify';
import ForgetPassword from '../Public Page/Password/forgetpassword';
import ResetPassword from '../Public Page/Password/ResetPassword';
//Always Accessible 
import Errorpage from '../Pages/Errorpage';
import Contact from '../Pages/Contact';
import { Toaster } from 'react-hot-toast';


// GitHub Callback Component
const GitHubCallback = () => {
    return <Login />;
};

function AppRouter() {
    return (
        <>
            <Toaster />
            <Routes>

                {/* 🔐----------------- Private routes ------------------ */}
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Home />} />                            {/*main router*/}
                    <Route path="/contact/:token" element={<Home />} />              {/*contact verifiction router/token*/}
                    <Route path="/:tab" element={<Home />} />                        {/*all icon router*/}
                </Route>

                {/* 🆓----------------- Public routes ------------------- */}
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />                      {/*login router*/}
                    <Route path="/register" element={<Register />} />                {/*register router*/}
                    <Route path="/otp-verify" element={<OtpVerify />} />             {/*otp-verify router*/}
                    <Route path="/forget-password" element={<ForgetPassword />} />   {/*forget-password router*/}
                    <Route path="/reset-password" element={<ResetPassword />} />     {/*reset-password router*/}
                    <Route path="/github/callback" element={<GitHubCallback />} />   {/*github-callback router*/}
                </Route>

                {/* 📃--------------- Always Accessible --------------- */}

                <Route path="/contactes" element={<Contact />} />                    {/*Contect Page router*/}
                <Route path='*' element={<Errorpage />} />                           {/*Error Page*/}

            </Routes>
        </>
    );
};

export default AppRouter;