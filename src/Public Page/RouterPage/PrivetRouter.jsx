import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLoginUser } from '../../feature/Slice/Auth/LoginUserSlice';

function PrivateRoute() {
  const dispatch = useDispatch();

  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  console.log('✌️loading --->', loading);
  console.log('✌️isAuthenticated --->', isAuthenticated);

  {
    /*Login User Data Api Call*/
  }
  useEffect(() => {
    dispatch(fetchLoginUser());
  }, [dispatch]);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '20px' }}>Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;
