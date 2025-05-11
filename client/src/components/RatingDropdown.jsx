import React, { useEffect, useState } from "react";
import axios from "axios";

const RatingDropdown = ({ criteria, setCriteria }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState("Select genre");

  const apiRoute = "http://localhost:3000/genres";

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOption = (action) => {
    setIsOpen(false);

    setGenre(action);
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

export default RatingDropdown;
