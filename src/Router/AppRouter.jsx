import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
//error Page
import Errorpage from '../Pages/Errorpage';
//Contact Page
import Contact from '../Pages/Contact';
import { Toaster } from 'react-hot-toast';


// GitHub Callback Component
const GitHubCallback = () => {
    return <Login />;
};

function AppRouter() {

    //Theme Slice
    const theme = useSelector((state) => state.theme.mode);

    //change value in theme
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
                    <Route path="/github/callback" element={<GitHubCallback />} />
                </Route>

                {/* 📃--------------- Always Accessible --------------- */}

                <Route path="/contactes" element={<Contact />} />                    {/*Contect Page router*/}
                <Route path='*' element={<Errorpage />} />                           {/*Error Page*/}

            </Routes>
        </>
    );
};

export default AppRouter;