import React, { useEffect, useState } from "react";
import axios from "axios";

const OwnedReview = ({ userID, rating, text, startEdit, setPosterID }) => {
  const [username, setUsername] = useState("");

  const stars = [1, 2, 3, 4, 5];

  const apiRoute = "http://localhost:3000/users";

  useEffect(() => {
    setPosterID(userID);
    axios
      .get(apiRoute + `?id=${userID}`)
      .then((res) => {
        setUsername(res.data);
      })
      .catch((err) => {
        console.log(err.response?.data);
      });
  }, []);

  return (
    <div className="flex flex-col outline-1 outline-amber-50 px-8 py-8 rounded-2xl pb-8 max-w-[80%] relative">
      <h1 className="text-2xl font-bold">{username}</h1>
      <div className="flex items-center gap-1 text-3xl text-yellow-300 mb-1">
        {stars.map((u) => (
          <div
            key={u}
            onClick={() => {
              setStars(u + 1);
            }}
          >
            {u <= rating ? "★" : "☆"}
          </div>
        ))}
      </div>
      <p className="text-xl text-gray-200">{text}</p>

      <div className="absolute flex justify-end ml-[-2rem] mt-[-2rem] pr-6 pt-3 h-full w-full items-baseline group">
        <button
          className="outline-0 text-[#222] outline-gray-200 px-3 py-1 rounded-xl  group-hover:text-white
         hover:bg-white hover:text-black cursor-pointer transition-all"
          onClick={startEdit}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default OwnedReview;
