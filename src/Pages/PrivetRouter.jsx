import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { checkAuth } from "../feature/Slice/GetuserSlice";

function PrivateRoute() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    // console.log('✌️isAuthenticated --->', isAuthenticated);
    const status = useSelector((state) => state.checkAuth.status);
    // console.log('✌️status --->', status);

    useEffect(() => {
        if (status === "idle") {
            dispatch(checkAuth());
        }
    }, [dispatch, status]);

    if (status === "loading") {
        return <p className="text-white text-center mt-10">Loading authentication...</p>;
    }

    if (status === "failed" && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default PrivateRoute;
