import React, { useRef } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [offset, setOffset] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [limitReached, setLimitReached] = useState(false);

  const initialLoadDone = useRef(false);

  const apiRoute = "http://localhost:3000/movies";

  useEffect(() => {
    if (offset === 5 && initialLoadDone.current) return;

    if (offset === 5) initialLoadDone.current = true;
    loadMovies(0, 10);
  }, []);

  useEffect(() => {
    if (offset > 5) loadMovies(offset, 5);
  }, [offset]);

  const loadMovies = (off, lim) => {
    setIsLoading(true);
    axios
      .get(apiRoute + `/names?offset=${off}&limit=${lim}`)
      .then((res) => {
        setMovies((prev) => [...prev, ...res.data.movies]);
        setLimitReached(res.data.limitReached);
        console.log(movies, res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.response?.data);
        setLimitReached(true);
        setIsLoading(false);
      });
  };

  const handleLoadMore = () => {
    setOffset((o) => o + 5);
  };
  const handleShowLess = () => {
    setLimitReached(false);
    setMovies([]);
    loadMovies(0, 10);
    setOffset(5);
  };

  return (
    <>
      <Navbar />
      <div className="w-full h-full px-22 py-12 grid grid-cols-5 gap-x-4 gap-y-12 min-w-max">
        {!isLoading ? (
          movies.map((movie) => (
            <MovieCard path={movie.path} key={movie.path} />
          ))
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
      <div className="w-max mx-auto mb-10">
        {!limitReached ? (
          <button
            className="text-md bg-indigo-500 px-4 py-2 rounded-4xl cursor-pointer"
            onClick={handleLoadMore}
          >
            Load more
          </button>
        ) : (
          <button
            className="text-md bg-indigo-500 px-4 py-2 rounded-4xl cursor-pointer "
            onClick={handleShowLess}
          >
            Hide
          </button>
        )}
      </div>
    </>
  );
};

export default HomePage;
