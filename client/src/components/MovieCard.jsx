import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const MovieCard = ({ path }) => {
  const navigate = useNavigate();

  const [movieInfo, setMovieInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const apiRoute = import.meta.env.VITE_MOVIES_URL;

  useEffect(() => {
    // get movie info by name
    axios
      .get(apiRoute + `/movie?name=${path}`)
      .then((res) => {
        setMovieInfo(res.data);
      })
      .catch((err) => {
        console.log(err.response?.data);
      });
    setIsLoading(false);
  }, []);
  return !isLoading ? (
    <Link
      to={`/movie/${movieInfo.path}`}
      className="w-55 h-80 bg-gray-900 flex flex-col items-center relative rounded-xl group cursor-pointer min-w-max max-w-max"
    >
      <img
        src={movieInfo.url}
        alt={movieInfo.path}
        className=" w-full h-full object-cover rounded-xl  shadow-md group-hover:shadow-xl transition-shadow duration-300 "
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40 rounded-bl-xl rounded-br-xl"></div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black opacity-40 rounded-bl-xl rounded-br-xl"></div>

      <div className="absolute inset-0 shadow-md group-hover:shadow-2xl transition-all duration-300 rounded-bl-xl rounded-br-xl"></div>
      <div className="absolute bottom-2 text-gray-200 font-bold text-center max-w-[90%]">
        {movieInfo.movie_name}
      </div>
    </Link>
  ) : (
    <h1>Loading...</h1>
  );
};

export default MovieCard;
