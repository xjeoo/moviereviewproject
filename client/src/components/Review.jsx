import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Review = ({ userID, rating, text }) => {
  const [username, setUsername] = useState("");

  const stars = [1, 2, 3, 4, 5];

  const apiRoute = import.meta.env.VITE_USERS_URL;

  useEffect(() => {
    axios
      .get(apiRoute + `?id=${userID}`)
      .then((res) => {
        setUsername(res.data.username);
      })
      .catch((err) => {
        console.log(err.response?.data);
      });
  }, []);

  return (
    <div className="flex flex-col outline-1 outline-amber-50 px-8 py-8 rounded-2xl pb-8 lg:w-200 md:w-150 max-w-[80%]">
      <Link to={`/profile/${userID}`} className="text-2xl max-w-fit">
        {username}
      </Link>
      <div className="flex items-center gap-1 text-3xl text-yellow-300 mb-1">
        {stars.map((u) => (
          <div key={u}>{u <= rating ? "★" : "☆"}</div>
        ))}
      </div>
      <p className="flex flex-wrap basis-[100%] text-xl text-gray-200">
        {text}
      </p>
    </div>
  );
};

export default Review;
