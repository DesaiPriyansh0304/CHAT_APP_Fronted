import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const status = useSelector((state) => state.checkAuth.status);

    if (status === "loading") {
        return <p className="text-white text-center mt-10">Checking auth...</p>;
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
