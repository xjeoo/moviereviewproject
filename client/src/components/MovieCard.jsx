import React from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ name, route }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/movie/${name}`);
  };
  return (
    <div className="w-55 h-80 bg-gray-900 flex flex-col items-center relative rounded-xl group cursor-pointer mr-8">
      <img
        src={route}
        alt={name}
        className=" w-full h-full object-cover rounded-xl shadow-md group-hover:shadow-xl transition-shadow duration-300 "
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40"></div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black opacity-40"></div>

      <div className="absolute inset-0 shadow-md group-hover:shadow-2xl transition-all duration-300"></div>
      <div className="absolute bottom-2 text-gray-200  ">{name}</div>
    </div>
  );
};

export default MovieCard;
