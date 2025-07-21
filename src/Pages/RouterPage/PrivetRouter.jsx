import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../../feature/Slice/Auth/AuthSlice";

function PrivateRoute() {
    const [isAuthValid, setIsAuthValid] = useState(null);  //AUthvalidation
    const dispatch = useDispatch();
    const URL = import.meta.env.VITE_REACT_APP;

    useEffect(() => {
        const verifyUser = async () => {

            {/*Get Token*/ }
            const token = localStorage.getItem("Authtoken");
            // console.log('ℹ️token --->/PrivetRouter', token);
            if (!token) {
                setIsAuthValid(false);
                return;
            }

            try {
                {/*decoded Token*/ }
                const decoded = jwtDecode(token);
                const userId = decoded?.userId;
                // console.log("🧑‍💻 Decoded User ID/PrivetRouter:", userId);

                const response = await axios.get(`${URL}/api/auth/check/${userId}`);
                // console.log('🧾response --->/PrivetRouter', response);
                // console.log("📦 Auth Check Response/PrivetRouter:", response.data.user);

                if (response.data.success && response.data.user) {
                    dispatch(addUser({ user: response.data.user, token }));
                    setIsAuthValid(true);
                } else {
                    setIsAuthValid(false);
                }
            } catch (error) {
                console.error("🔴 Auth check failed", error);
                setIsAuthValid(false);
            }
        };

        verifyUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]); //clean: no dispatch/token dependency warning

    if (isAuthValid === null) {
        return <div>Loading...</div>;
    }

    if (!isAuthValid) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
}

export default PrivateRoute;
