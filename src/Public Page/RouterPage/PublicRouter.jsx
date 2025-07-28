import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = () => {
  {
    /* Auth Slice */
  }
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  console.log('✌️isAuthenticated --->', isAuthenticated);

  if (isAuthenticated === null || isAuthenticated === undefined) {
    return <div>Loading...</div>;
  }
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
