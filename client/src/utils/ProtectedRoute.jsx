import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = () => {
  const authData = useAuth();
  const apiRoute = import.meta.env.VITE_AUTH_VERIFY_URL;

  const [authorized, setAuthorized] = useState(false);

  const navigate = useNavigate();

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

            setAuthorized(true);
          })
          .catch((err) => {
            console.log(err);
            setAuthorized(false);
            authData.logout(authData.data.user_id);
            navigate("/login");
          });
    } catch (err) {
      console.log(err.response?.data);
      navigate("/login");
    }
  }, [authData.isLoading]);
  if (authData.isLoading) return <h1>Loading...</h1>;
  else return { authorized } ? <Outlet /> : <Navigate to={"/login"} />;
};

export default ProtectedRoute;
