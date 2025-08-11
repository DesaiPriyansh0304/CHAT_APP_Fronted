import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
//LoginUser SLice
import { fetchLoginUser } from '../../feature/Slice/Auth/LoginUserSlice';

function PrivateRoute() {

  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth || {});                     //AuthSlice 
  const loginUserState = useSelector((state) => state.loginUser || {});           //LoginuserSlice

  const { isAuthenticated } = authState;
  const { loading, error } = loginUserState;

  // console.log('isAuthenticated ->/auth/PrivetRouter', isAuthenticated);
  // console.log('loading ->/LoginUser/PrivetRouter', loading);
  // console.log('error ->/LoginUser/PrivetRouter', error);

  //LoginUser Api Call 
  useEffect(() => {
    dispatch(fetchLoginUser());
  }, [dispatch]);


  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <h3 className="text-2xl text-blue-600">
          Checking authentication...
        </h3>
      </div>
    );
  }


  if (!isAuthenticated || error) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;
