import React, { useRef } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import SearchCriteria from "../components/SearchCriteria";
import GenreDropdown from "../components/GenreDropdown";
import SortDropdown from "../components/SortDropdown";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [searched, setSearched] = useState(false);
  const [searchedOffset, setSearchedOffset] = useState(0);
  const [offset, setOffset] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [limitReached, setLimitReached] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [criteria, setCriteria] = useState("Search by");
  const [criteriaValue, setCriteriaValue] = useState(null);
  const [sortMode, setSortMode] = useState("Sort By Rating");

  const initialLoadDone = useRef(false);

  const moviesApiRoute = import.meta.env.VITE_MOVIES_URL;
  const genreApiRoute = import.meta.env.VITE_GENRES_URL;

  useEffect(() => {
    if (offset === 5 && initialLoadDone.current) return;
    if (offset === 5) initialLoadDone.current = true;

    loadMovies(0, 10);
  }, []);

  useEffect(() => {
    if (offset > 5) loadMovies(offset, 5);
    setMovies((prev) => sortMovies(prev));
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
      .get(moviesApiRoute + `/names?offset=${off}&limit=${lim}`)
      .then((res) => {
        setMovies((prev) => [...prev, ...res.data.movies]);
        setLimitReached(res.data.limitReached);
        setMovies((prev) => sortMovies(prev));

        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.response?.data);
        setLimitReached(true);
        setIsLoading(false);
      });
  };

  const handleLoadMore = () => {
    if (searched) {
      setSearchedOffset((o) => o + 5);
    } else {
      setOffset((o) => o + 5);
    }
  };
  const handleShowLess = () => {
    setLimitReached(false);
    setMovies([]);
    loadMovies(0, 10);
    setOffset(5);
  };

  const handleSearch = () => {
    axios
      .get(
        genreApiRoute + `/search?q=${searchInput}&g=${criteriaValue || "Any"}`
      )
      .then((res) => {
        setSearchedMovies(res.data);
        setSearched(true);
        setSearchedMovies((prev) => sortMovies(prev));
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response?.data);
      });
  };

  const sortMovies = (array) => {
    let copy = [...array];

    if (sortMode === "Ascending")
      return copy.sort((a, b) => Number(a.rating) - Number(b.rating));
    if (sortMode === "Descending")
      return copy.sort((a, b) => Number(b.rating) - Number(a.rating));

    return copy;
  };

  useEffect(() => {
    if (searched) setSearchedMovies((prev) => sortMovies(prev));
    else setMovies((prev) => sortMovies(prev));
  }, [sortMode]);

  return (
    <>
      <Navbar />
      <div className="flex justify-center  w-full mt-10 ">
        <div className="flex lg:flex-row flex-col justify-between items-center gap-10 z-10">
          {searched ? (
            <button
              className="bg-indigo-500 px-0.5 py-0.5 rounded-4xl cursor-pointer min-w-fit"
              onClick={() => {
                window.location.reload();
              }}
            >
              <img src="/icons/refresh.png" alt="refresh" className="w-9 h-9" />
            </button>
          ) : null}
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
            <SortDropdown
              movies={searchedMovies.length > 0 ? searchedMovies : movies}
              setMovies={
                searchedMovies.length > 0 ? setSearchedMovies : setMovies
              }
              sortMode={sortMode}
              setSortMode={setSortMode}
            />
          </div>
        </div>
      </div>

      <div className="flex w-full h-full justify-center items-center">
        <div className=" px-22 pb-12 pt-14 grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-12 min-w-fit">
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
