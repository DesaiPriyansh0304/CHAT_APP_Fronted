import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_REACT_APP;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authtoken')); // get token
  const [authUser, setAuthUser] = useState(null); // get user
  const [onlineUser, setOnlineUser] = useState([]); // get OnlineUser
  const [socket, setSocket] = useState(null); // get socket

  // Check if user is authenticated in connected in soket io
  const checkAuth = async () => {
    try {
      const response = await axios.get(`${URL}/api/auth/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setAuthUser(response.data.user);
        connectsocket(response.data.user);
      }
    } catch (error) {
      toast.error('AuthContxet', error);
      console.log('AuthContext /error ->', error);
    }
  };

  ///Logout Data
  const logout = async () => {
    localStorage.removeItem('authtoken');
    setToken(null);
    setAuthUser(null);
    setOnlineUser([]);
    toast.success('Logout Successfull');
    socket.disconnect();
  };

  //update Profile

  const updateProfile = async () => {
    try {
      const response = await axios.get(`${URL}/api/auth/update-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setAuthUser(response.data.user);
        connectsocket(response.data.user);
      }
    } catch (error) {
      console.log('✌️error --->', error);
      toast.error('AuthContxet/updateProfile', error);
    }
  };

  //

  //socket io connection and user update
  const connectsocket = async (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(URL, {
      query: {
        userId: userData._id,
      },
    });
    newSocket.connect();
    setSocket(newSocket);
    newSocket.on('getOnlineUser', (userIds) => {
      setOnlineUser(userIds);
    });
  };

  useEffect(() => {
    if (token) {
      checkAuth();
    }
  }, [token]);

  const value = {
    token,
    authUser,
    onlineUser,
    socket,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
