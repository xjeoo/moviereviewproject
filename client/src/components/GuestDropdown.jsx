import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";

const GuestDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOption = (action) => {
    setIsOpen(false);

    if (action === "sign-in") {
      navigate("/login");
    }
  };
  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="bg-indigo-800 hover:bg-indigo-900 px-4 py-2 rounded cursor-pointer "
      >
        Guest
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-indigo-800 hover:bg-indigo-900 rounded shadow-lg z-10  ">
          <button
            onClick={() => handleOption("sign-in")}
            className="w-full flex justify-center px-4 py-2 text-left bg-indigo-800 hover:bg-indigo-900 cursor-pointer"
          >
            Sign-in
          </button>
        </div>
      )}
    </div>
  );
};

export default GuestDropdown;
