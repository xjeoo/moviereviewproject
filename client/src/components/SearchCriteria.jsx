import React, { useState } from "react";

const SearchCriteria = ({ criteria, setCriteria }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOption = (action) => {
    setIsOpen(false);

    if (action === "genre") {
      setCriteria("Genre");
    } else if (action === "rating") {
      setCriteria("Rating");
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="bg-indigo-500 hover:bg-indigo-500 px-4 py-2 rounded cursor-pointer"
      >
        {criteria}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-indigo-500 hover:bg-indigo-900 rounded shadow-lg z-10 ">
          <button
            onClick={() => handleOption("genre")}
            className="w-full flex justify-center px-4 py-2 text-left bg-indigo-500 hover:bg-indigo-900 cursor-pointer"
          >
            Genre
          </button>
          <button
            onClick={() => handleOption("rating")}
            className="w-full flex justify-center px-4 py-2 text-left bg-indigo-500 hover:bg-indigo-900 cursor-pointer"
          >
            Rating
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchCriteria;
