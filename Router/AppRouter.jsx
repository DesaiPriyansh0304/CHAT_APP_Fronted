import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Route Guards
import PrivateRoute from '../src/Public Page/RouterPage/PrivetRouter';
import PublicRoute from '../src/Public Page/RouterPage/PublicRouter';

// Private Pages
import Home from '../src/Pages/Home';

// Public Pages
import Login from '../src/Public Page/SignIn-SignUP/Login';
import Register from '../src/Public Page/SignIn-SignUP/Register';
import OtpVerify from '../src/Public Page/otp verify/OTPVerify';
import ForgetPassword from '../src/Public Page/Password/forgetpassword';
import ResetPassword from '../src/Public Page/Password/ResetPassword';

import { Toaster } from 'react-hot-toast';
import Contact from '../src/Pages/Contact';


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
            <div>
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
                    <Route>
                        <Route path="/contact" element={<Contact />} />   {/*GitHub OAuth callback router*/}
                    </Route>
                </Routes>

            </div >
        </>
    );
};

export default AppRouter;