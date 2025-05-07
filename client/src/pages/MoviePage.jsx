import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const MoviePage = () => {
  const [movieInfo, setMovieInfo] = useState({});

  const params = useParams();
  const movieName = params.name;
  const apiRoute = "http://localhost:3000/movies";

  useEffect(() => {
    // get movie info by name
    axios
      .get(apiRoute + `/movie?name=${movieName}`)
      .then((res) => {
        setMovieInfo(res.data);
      })
      .catch((err) => {
        console.log(err.response?.data);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="px-20 py-14 min-w-max max-w-[55%] mx-auto outline-1 outline-amber-50 rounded-4xl mt-14 backdrop-blur-xs">
        <div className="flex items-start ">
          <div className="w-95 h-120">
            <img
              src={movieInfo.url}
              alt={movieInfo.movie_name}
              className=" h-full w-full bg-gray-900 flex flex-col items-center rounded-md mr-8 min-w-max max-w-max "
            />
          </div>
          <div className="pl-8 flex flex-col justify-start gap-y-2.5">
            <h1 className="font-bold text-4xl font-mono">
              {movieInfo.movie_name}
            </h1>
            {movieInfo.genres ? (
              <div className="flex gap-4">
                {movieInfo.genres.map((u, index) => (
                  <p
                    key={index}
                    className="inline-block w-max px-2 outline-1 outline-gray-300 rounded-4xl"
                  >
                    {u.genre_name + " "}
                  </p>
                ))}
              </div>
            ) : null}
            <p className="text-xl font-bold">⭐ {movieInfo.rating}</p>
            <div className="flex-1 pt-10">
              <h2 className="text-2xl font-bold ">Description:</h2>
              <article className="italic mt-6">{movieInfo.description}</article>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Cast:</h2>
              <article className="italic mt-6">{movieInfo.cast}</article>
            </div>
          </div>
        </div>
        <div className="flex flex-col pt-10">
          <h1 className="text-4xl text-bold">Reviews:</h1>
        </div>
      </div>
    </>
  );
};

export default MoviePage;
