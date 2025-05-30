import React, { useEffect, useState } from "react";
import axios from "axios";

const GenreDropdown = ({ setCriteriaValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState("Any");

  const apiRoute = import.meta.env.VITE_GENRES_URL;

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOption = (action) => {
    setIsOpen(false);

    setGenre(action);
    setCriteriaValue(action);
  };

  useEffect(() => {
    axios
      .get(apiRoute)
      .then((res) => {
        setGenres(res.data);
      })
      .catch((err) => {
        console.log(err.response?.data);
      });
  }, []);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="bg-indigo-500 hover:bg-indigo-500 px-4 py-2 rounded cursor-pointer"
      >
        {genre}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-indigo-500 hover:bg-indigo-900 rounded shadow-lg z-10 ">
          <button
            onClick={() => handleOption("Any")}
            className="w-full flex justify-center px-4 py-2 text-left bg-indigo-500 hover:bg-indigo-900 cursor-pointer"
          >
            Any
          </button>
          {genres.map((g, index) => (
            <button
              onClick={() => handleOption(g.genre_name)}
              className="w-full flex justify-center px-4 py-2 text-left bg-indigo-500 hover:bg-indigo-900 cursor-pointer"
              key={index}
            >
              {g.genre_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenreDropdown;
