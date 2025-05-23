import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const deleteApiRoute = import.meta.env.VITE_LOGOUT_URL;
const navigate = useNavigate();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const localUserData = localStorage.getItem("userData");
    if (localUserData) setUserData(JSON.parse(localUserData));
    setIsLoading(false);
  }, []);

  const login = (user) => {
    setUserData(user);
    localStorage.setItem("userData", JSON.stringify(user));
  };

  const logout = (userID) => {
    const updatedUserData = { ...userData, isLoggedIn: false };
    setUserData(updatedUserData);
    if (userData !== undefined)
      if (userData.data !== null)
        axios
          .delete(deleteApiRoute + userID)
          .then((res) => console.log(res.data))
          .catch((err) => {
            console.log(err.response?.data);
          });
    localStorage.removeItem("userData");
    setUserData(null);
    navigate("/");
  };

  const values = {
    data: userData,
    setUserData,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
