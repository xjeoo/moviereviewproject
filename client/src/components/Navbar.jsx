import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import GuestDropdown from "./GuestDropdown";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const auth = useAuth();
  return (
    <nav className="w-full h-18 bg-indigo-600 flex justify-between px-10 items-center relative">
      <Link to={"/"} className="text-2xl text-gray-200 font-bold">
        Film<span className="text-orange-400">Hub</span>
      </Link>

      {auth.data?.username ? (
        <UserDropdown
          username={auth.data?.username}
          userID={auth.data?.user_id}
        />
      ) : (
        <GuestDropdown />
      )}
    </nav>
  );
};

export default Navbar;
