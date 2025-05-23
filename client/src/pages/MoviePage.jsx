import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Review from "../components/Review";
import CreateReview from "../components/CreateReview";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import OwnedReview from "../components/OwnedReview";
import EditPopUp from "../components/EditPopUp";
import DeletePopUp from "../components/DeletePopUp";

const MoviePage = () => {
  const [movieInfo, setMovieInfo] = useState({});
  const [reviews, setReviews] = useState([]);
  const [posterID, setPosterID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reviewModified, setReviewModified] = useState(false);

  const params = useParams();
  const movieName = params.name;
  const movieApiRoute = import.meta.env.VITE_MOVIES_URL;
  const reviewApiRoute = import.meta.env.VITE_REVIEWS_URL;

  const auth = useAuth();

  useEffect(() => {
    if (reviewModified) {
      axios
        .get(reviewApiRoute + `?movieID=${movieInfo.movie_id}`)
        .then((res) => {
          console.log(res.data);
          setReviews(res.data);
          setReviewModified(false);
        })
        .catch((err) => {
          console.log(err.response?.data);
          setReviewModified(false);
        });
    }
  }, [reviewModified]);

  useEffect(() => {
    // get movie info by name
    window.scrollTo(0, 0);
    axios
      .get(movieApiRoute + `/movie?name=${movieName}`)
      .then((res) => {
        setMovieInfo(res.data);
        // get reviews
        axios
          .get(reviewApiRoute + `?movieID=${res.data.movie_id}`)
          .then((res) => {
            console.log(res.data);
            setReviews(res.data);
          })
          .catch((err) => {
            console.log(err.response?.data);
          });
      })
      .catch((err) => {
        console.log(err.response?.data);
      });
    setIsLoading(false);
  }, []);

  const startEditing = () => {
    setIsEditing(true);
  };
  const stopEditing = () => {
    setIsEditing(false);
  };

  const startDelete = () => {
    setIsDeleting(true);
  };
  const stopDelete = () => {
    setIsDeleting(false);
  };
  return (
    <>
      {isEditing ? (
        <div className="absolute w-full h-full justify-center items-center">
          <EditPopUp
            movieID={movieInfo.movie_id}
            posterID={posterID}
            stopEdit={stopEditing}
            setReviewModified={setReviewModified}
          />
        </div>
      ) : null}
      {isDeleting ? (
        <div className="absolute w-full h-full justify-center items-center">
          <DeletePopUp
            movieID={movieInfo.movie_id}
            posterID={posterID}
            stopDelete={stopDelete}
            setReviewModified={setReviewModified}
          />
        </div>
      ) : null}
      <Navbar />

      <BackButton />
      <div className="flex flex-col lg:items-start items-center lg:px-20 py-14 lg:max-w-[70%] mx-auto lg:outline-1 outline-0 outline-amber-50 rounded-4xl my-14 backdrop-blur-xs">
        <div className="flex lg:items-start lg:flex-row flex-col lg:justify-start justify-center items-center ">
          <div className="flex lg:justify-start lg:mb-0 mb-4  justify-center w-95 h-120 min-w-fit">
            <img
              src={movieInfo.url}
              alt={movieInfo.movie_name}
              className="h-full bg-gray-900 rounded-lg lg:mr-4 mr-0 max-w-fit "
            />
          </div>
          <div className="lg:pl-8 flex flex-col justify-start gap-y-2.5 max-w-[50%]">
            <h1 className="font-bold text-4xl font-mono min-w-fit max-w-[100%] lg:text-start text-center">
              {movieInfo.movie_name}
            </h1>
            {movieInfo.genres ? (
              <div className="flex gap-4">
                {movieInfo.genres.map((u, index) => (
                  <p
                    key={index}
                    className="inline-block w-fit px-2 outline-1 outline-gray-300 rounded-4xl"
                  >
                    {u.genre_name + " "}
                  </p>
                ))}
              </div>
            ) : null}
            <p className="text-xl font-bold">⭐ {movieInfo.rating || 0}</p>
            <div className="flex-1 pt-10 md:max-w-fit max-w-[70%] w-fit">
              <h2 className="text-2xl font-bold ">Description:</h2>
              <article className="italic mt-6 w-fit lg:text-[1.05rem] text-xl">
                {movieInfo.description}
              </article>
            </div>
            <div className="w-fit">
              <h2 className="text-2xl font-bold mt-4">Cast:</h2>
              <article className="italic mt-6 lg:text-[1.05rem] text-xl">
                {movieInfo.cast}
              </article>
            </div>
          </div>
        </div>
        <hr className="mt-10" />
        <div className="flex flex-col lg:items-start items-center pt-10 gap-y-4 max-w-[95%] w-fit">
          <CreateReview
            movieID={movieInfo.movie_id}
            setReviewModified={setReviewModified}
          />
          {reviews.length > 0 ? (
            <>
              {reviews.map((r, index) =>
                r.poster_id === auth.data?.user_id ? (
                  <OwnedReview
                    userID={r.poster_id}
                    rating={r.rating}
                    text={r.comment}
                    startEdit={startEditing}
                    startDelete={startDelete}
                    setPosterID={setPosterID}
                    key={index}
                  />
                ) : (
                  <Review
                    userID={r.poster_id}
                    rating={r.rating}
                    text={r.comment}
                    key={index}
                  />
                )
              )}
            </>
          ) : (
            <p className="text-xl">No reviews yet</p>
          )}
        </div>
      </div>
    </>
  );
};

export default MoviePage;
