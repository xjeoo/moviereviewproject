import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import GuestDropdown from "./GuestDropdown";
import { useAuth } from "../context/authContext";

const Navbar = () => {
  //trebuie sa pun link-uri in return
  const auth = useAuth();
  return (
    <nav className="w-dvw h-18 bg-indigo-600 flex justify-between px-10 items-center">
      <Link to={"/"} className="text-2xl text-gray-200 font-bold">
        Film<span className="text-orange-400">Hub</span>
      </Link>

      {auth.data?.username ? (
        <UserDropdown username={auth.data?.username} />
      ) : (
        <GuestDropdown />
      )}
    </nav>
  );
};

export default Navbar;
