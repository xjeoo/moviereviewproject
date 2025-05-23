import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";

const UserDropdown = ({ username, userID }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOption = (action) => {
    setIsOpen(false);

    if (action === "profile") {
      navigate(`/profile/${auth.data.user_id}`);
    } else if (action === "logout") {
      auth.logout(userID);
    }
  };

  return (
    <div className="relative inline-block text-left z-50">
      <button
        onClick={toggleDropdown}
        className="bg-indigo-800 hover:bg-indigo-900 px-4 py-2 rounded cursor-pointer"
      >
        {username}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-indigo-800 hover:bg-indigo-900 rounded shadow-lg z-10 ">
          <button
            onClick={() => handleOption("profile")}
            className="w-full flex justify-center px-4 py-2 text-left bg-indigo-800 hover:bg-indigo-900 cursor-pointer"
          >
            Profile
          </button>
          <button
            onClick={() => handleOption("logout")}
            className="w-full flex justify-center px-4 py-2 text-left bg-indigo-800 hover:bg-indigo-900 cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
