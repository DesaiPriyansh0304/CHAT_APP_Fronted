import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = () => {

  const authState = useSelector((state) => state.auth || {});      //authSlice

  const { isAuthenticated } = authState;
  // console.log('isAuthenticated/Auth --->/PublicRouter', isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
