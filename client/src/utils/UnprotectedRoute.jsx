import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = () => {
  const authData = useAuth();
  const apiRoute = import.meta.env.VITE_AUTH_VERIFY_URL;

  useEffect(() => {
    try {
      if (!authData.isLoading)
        axios
          .post(
            apiRoute,
            {
              user_id: authData.data.user_id,
            },
            {
              headers: {
                Authorization: `Bearer ${authData.data.access_token}`,
              },
              withCredentials: true,
            }
          )
          .then((res) => {
            if (res.status === 201)
              localStorage.setItem("userData", JSON.stringify(res.data));
          })
          .catch((err) => {
            console.log(err);
            authData.logout(authData.data.user_id);
          });
    } catch (err) {
      console.log(err);
    }
  }, [authData.isLoading]);
  if (authData.isLoading) return <h1>Loading...</h1>;
  else return <Outlet />;
};

export default ProtectedRoute;
