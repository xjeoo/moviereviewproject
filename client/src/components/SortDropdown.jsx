import React, { useEffect, useState } from "react";
import axios from "axios";

const GenreDropdown = ({ sortMode, setSortMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const SortDropdown = () => setIsOpen(!isOpen);

  const handleOption = (action) => {
    setIsOpen(false);
    setSortMode(action);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={SortDropdown}
        className="bg-indigo-500 hover:bg-indigo-500 px-4 py-2 rounded cursor-pointer"
      >
        {sortMode}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-indigo-500 hover:bg-indigo-900 rounded shadow-lg z-10 ">
          <button
            onClick={() => handleOption("Ascending")}
            className="w-full flex justify-center px-4 py-2 text-left bg-indigo-500 hover:bg-indigo-900 cursor-pointer"
          >
            Ascending
          </button>
          <button
            onClick={() => handleOption("Descending")}
            className="w-full flex justify-center px-4 py-2 text-left bg-indigo-500 hover:bg-indigo-900 cursor-pointer"
          >
            Descending
          </button>
        </div>
      )}
    </div>
  );
};

export default GenreDropdown;
