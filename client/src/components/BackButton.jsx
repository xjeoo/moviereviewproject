import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div
      className="hidden lg:inline-block ml-6 mt-4 px-3 py-1.5 outline-1 outline-white text-white w-max text-xl rounded-4xl cursor-pointer hover:bg-white hover:text-black transition-colors"
      onClick={goBack}
    >
      ◄ Back
    </div>
  );
};

export default BackButton;
