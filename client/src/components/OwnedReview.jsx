import React, { useEffect, useState } from "react";
import axios from "axios";

const OwnedReview = ({
  userID,
  rating,
  text,
  startEdit,
  startDelete,
  setPosterID,
}) => {
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
      <h1 className="text-2xl font-bold z-10  inline-block w-max">
        {username}
      </h1>
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
      <p className="text-xl text-gray-200 z-10 inline-block w-max">{text}</p>

      <div className="absolute flex justify-end ml-[-2rem] mt-[-2rem] pr-6 pt-3 h-full w-full items-baseline">
        <div className="flex gap-3">
          <button
            className="outline-1 outline-white px-2 py-0.5 rounded-4xl hover:bg-white hover:outline-white hover:text-black cursor-pointer transition-colors"
            onClick={startEdit}
          >
            Edit
          </button>
          <button
            className="outline-1 outline-white px-2 py-0.5 rounded-4xl hover:bg-red-700 hover:outline-red-700 hover:text-white cursor-pointer transition-colors"
            onClick={startDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnedReview;
