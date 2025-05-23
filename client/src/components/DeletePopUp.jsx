import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DeletePopUp = ({ movieID, posterID, stopDelete }) => {
  const [text, setText] = useState("");
  const [stars, setStars] = useState(0);
  const [reviewID, setReviewID] = useState(null);
  const rating = [1, 2, 3, 4, 5];

  const auth = useAuth();
  const apiRoute = import.meta.env.VITE_REVIEWS_URL;
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    axios
      .get(apiRoute + `/id?m=${movieID}&p=${posterID}`)
      .then((res) => {
        setReviewID(res.data);
      })
      .catch((err) => {
        console.log(err.response?.data);
      });

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const deleteReview = () => {
    if (auth.data === null) navigate("/login");
    axios
      .delete(apiRoute + `/delete/${reviewID}`, {
        headers: { Authorization: `Bearer ${auth.data.access_token}` },
      })
      .then((res) => {
        stopDelete();
        window.location.reload();
      })
      .catch((err) => {
        console.log(err.response?.data);
      });
  };

  return (
    <div className="fixed w-full h-full flex justify-center z-50 backdrop-blur-md">
      <button
        className="absolute right-10 top-5 outline-2 outline-white text-4xl flex items-center justify-center px-4 pb-2 rounded-4xl
                        hover:bg-white hover:text-black cursor-pointer transition-all"
        onClick={stopDelete}
      >
        x
      </button>
      <div className="mt-80 flex flex-col items-center">
        <h1 className="text-4xl font-bold">
          Are you sure you want to delete your review?
        </h1>
        <div className="flex gap-10 mt-15">
          <button
            className="bg-red-700 text-3xl px-4 py-2 rounded-4xl w-20 hover:bg-red-800 transition-colors cursor-pointer"
            onClick={stopDelete}
          >
            No
          </button>
          <button
            className="bg-green-700 text-3xl px-4 py-2 rounded-4xl w-20 hover:bg-green-800 transition-colors cursor-pointer"
            onClick={deleteReview}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopUp;
