import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateReview = ({ movieID, setReviewModified }) => {
  const [text, setText] = useState("");
  const [stars, setStars] = useState(0);
  const rating = [1, 2, 3, 4, 5];

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const auth = useAuth();
  const apiRoute = import.meta.env.VITE_REVIEWS_POST_URL;
  const navigate = useNavigate();

  const handlePost = () => {
    setError("");
    setSuccess(false);
    if (auth.data === null) navigate("/login");
    axios
      .post(
        apiRoute,
        {
          movie_id: movieID,
          user_id: auth.data.user_id,
          rating: stars,
          text: text,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.data.access_token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setSuccess(true);
        setReviewModified(true);
      })
      .catch((err) => {
        console.log(err);
        setError(err.response?.data);
      });
  };

  useEffect(() => {
    if (success === true)
      setTimeout(() => {
        setSuccess(false);
      }, 1500);
  }, [success]);

  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold mb-2">Leave a review:</h1>
      {error?.trim() !== "" ? (
        <h2 className="text-xl text-red-600">{error}</h2>
      ) : null}
      {success ? (
        <h2 className="text-xl text-green-600">Review posted</h2>
      ) : null}
      <div className="relative min-w-fit w-[40%]">
        <div className="flex items-center gap-1 text-3xl text-yellow-300 mb-1">
          {rating.map((u) => (
            <div
              key={u}
              className="cursor-pointer hover:scale-[1.1]"
              onClick={() => {
                setStars(u);
              }}
            >
              {u <= stars ? "★" : "☆"}
            </div>
          ))}
        </div>
        <textarea
          className="md:min-h-25 min-h-30 sm:min-w-100 min-w-70 bg-gray-300 text-black px-4 py-3 rounded-xl w-full"
          placeholder="Type your review:"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        ></textarea>
        {text.trim() !== "" ? (
          <button
            className="px-1.5 bg-indigo-500 rounded-4xl  text-xl absolute right-2 bottom-2 cursor-pointer transition-colors"
            onClick={handlePost}
          >
            &#x2713;
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default CreateReview;
