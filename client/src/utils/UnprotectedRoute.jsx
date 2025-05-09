import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = () => {
  const authData = useAuth();
  const apiRoute = "http://localhost:3000/auth/verify";

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
                authorization: `Bearer ${authData.data.access_token}`,
              },
              withCredentials: true,
            }
          )
          .then((res) => {
            if (res.status === 201)
              localStorage.setItem("userData", JSON.stringify(res.data));

            console.log(res.data);
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
