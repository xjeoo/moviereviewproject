import React, { useRef } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import SearchCriteria from "../components/SearchCriteria";
import GenreDropdown from "../components/GenreDropdown";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [searched, setSearched] = useState(false);
  const [offset, setOffset] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [limitReached, setLimitReached] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [criteria, setCriteria] = useState("Search by");
  const [criteriaValue, setCriteriaValue] = useState(null);

  const initialLoadDone = useRef(false);

  const apiRoute = "http://localhost:3000/movies";
  const genreApiRoute = "http://localhost:3000/genres";

  useEffect(() => {
    if (offset === 5 && initialLoadDone.current) return;
    if (offset === 5) initialLoadDone.current = true;

    loadMovies(0, 10);
  }, []);

  useEffect(() => {
    if (offset > 5) loadMovies(offset, 5);
  }, [offset]);

  useEffect(() => {
    if (
      criteria !== "Genre" &&
      criteria !== "Rating" &&
      criteria !== "Search by"
    )
      setCriteriaValue(criteria);
  }, [criteria]);

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

  const loadSearchedMovies = (off, lim) => {};

  const handleLoadMore = () => {
    setOffset((o) => o + 5);
  };
  const handleShowLess = () => {
    setLimitReached(false);
    setMovies([]);
    loadMovies(0, 10);
    setOffset(5);
  };

  useEffect(() => {
    console.log(criteriaValue);
  }, [criteriaValue]);

  const handleSearch = () => {
    axios
      .post(genreApiRoute + "/search", {
        input: searchInput,
        genre: criteriaValue || "Any",
      })
      .then((res) => {
        setSearchedMovies(res.data);
        setSearched(true);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response?.data);
      });
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center  w-full mt-10 ">
        <div className="flex justify-between items-center gap-10 z-10">
          <div className="min-w-fit">
            <input
              type="text"
              value={searchInput}
              className="bg-gray-500  min-w-40 rounded-l-4xl pl-3 py-2 text-xl outline-0"
              placeholder="Search"
              onChange={(i) => {
                setSearchInput(i.target.value);
              }}
            />
            <button
              className="w-fit bg-indigo-500 px-3 py-2 text-xl rounded-r-4xl cursor-pointer"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          <div className="flex gap-4">
            <SearchCriteria criteria={criteria} setCriteria={setCriteria} />
            {criteria === "Genre" ? (
              <GenreDropdown setCriteriaValue={setCriteriaValue} />
            ) : null}
          </div>
        </div>
      </div>

      <div className="w-full h-full px-22 pb-12 pt-14 grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-x-4 gap-y-12 min-w-max">
        {!isLoading ? (
          searched ? (
            searchedMovies.map((searchedmovie) => (
              <MovieCard path={searchedmovie.path} key={searchedmovie.path} />
            ))
          ) : (
            movies.map((movie) => (
              <MovieCard path={movie.path} key={movie.path} />
            ))
          )
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
      <div className="w-max mx-auto mb-10">
        {searched ? null : !limitReached ? (
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
