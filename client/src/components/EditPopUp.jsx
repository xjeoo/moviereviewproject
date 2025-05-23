import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditPopUp = ({ movieID, posterID, stopEdit }) => {
  const [text, setText] = useState("");
  const [stars, setStars] = useState(0);
  const rating = [1, 2, 3, 4, 5];

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const auth = useAuth();
  const apiRoute = import.meta.env.VITE_REVIEWS_EDIT_URL;
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleEdit = () => {
    setError("");
    setSuccess(false);
    if (auth.data === null) navigate("/login");
    axios
      .patch(
        apiRoute,
        {
          movie_id: movieID,
          user_id: auth.data.user_id,
          rating: stars,
          text: text,
        },
        {
          headers: { Authorization: `Bearer ${auth.data.access_token}` },
        }
      )
      .then((res) => {
        console.log(res);
        setSuccess(true);
        window.location.reload();
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
    <div className="fixed w-full h-full flex justify-center z-50 backdrop-blur-md">
      <button
        className="absolute right-10 top-5 outline-2 outline-white text-4xl flex items-center justify-center px-4 pb-2 rounded-4xl
                        hover:bg-white hover:text-black cursor-pointer transition-all"
        onClick={stopEdit}
      >
        x
      </button>
      <div className="flex mt-40  ">
        <div className="text-4xl flex flex-col items-center px-8 py-12 bg-gray-700 outline-1 outline-gray-200 max-h-max rounded-2xl">
          <h1 className="text-4xl mb-8">Edit your review:</h1>
          {error.trim() !== "" ? (
            <h2 className="text-3xl text-red-600 max-w-100%">{error}</h2>
          ) : null}
          {success ? (
            <h2 className="text-3xl text-green-600">Success</h2>
          ) : null}
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
            className="text-2xl min-h-30 bg-gray-300 text-black px-4 py-3 rounded-xl w-[90%] block"
            placeholder="Type your review:"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          ></textarea>
          <button
            className="text-3xl bg-indigo-500 mt-10 rounded-4xl px-4 py-2 cursor-pointer hover:bg-indigo-600 transition-colors"
            onClick={handleEdit}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPopUp;
