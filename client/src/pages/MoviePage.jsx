import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Review from "../components/Review";
import CreateReview from "../components/CreateReview";
import { useAuth } from "../context/authContext";
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

  const params = useParams();
  const movieName = params.name;
  const movieApiRoute = "http://localhost:3000/movies";
  const reviewApiRoute = "http://localhost:3000/reviews";

  const auth = useAuth();

  useEffect(() => {
    try {
      console.log("succeded");
    } catch (error) {
      console.log("failed");
    }
  }, [auth.isLoading]);

  useEffect(() => {
    // get movie info by name
    axios
      .get(movieApiRoute + `/movie?name=${movieName}`)
      .then((res) => {
        setMovieInfo(res.data);
        // get reviews
        axios
          .get(reviewApiRoute + `?movieID=${res.data.movie_id}`)
          .then((res) => {
            setReviews(res.data);
            console.log(res.data);
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
          />{" "}
          {
            // AICI TREBUIE SA II DAU SI POSTER ID
            // PROBABIL FAC UN STATE DE UNDE SA IAU review[index]
          }
        </div>
      ) : null}
      {isDeleting ? (
        <div className="absolute w-full h-full justify-center items-center">
          <DeletePopUp
            movieID={movieInfo.movie_id}
            posterID={posterID}
            stopDelete={stopDelete}
          />
        </div>
      ) : null}
      <Navbar />

      <BackButton />
      <div className="px-20 py-14 min-w-fit max-w-[70%] mx-auto outline-1 outline-amber-50 rounded-4xl my-14 backdrop-blur-xs">
        <div className="flex md:items-start md:flex-row flex-col justify-center items-center ">
          <div className="w-95 h-120 min-w-fit">
            <img
              src={movieInfo.url}
              alt={movieInfo.movie_name}
              className="h-full bg-gray-900 rounded-md mr-4 "
            />
          </div>
          <div className="pl-8 flex flex-col justify-start gap-y-2.5">
            <h1 className="font-bold text-4xl font-mono">
              {movieInfo.movie_name}
            </h1>
            {movieInfo.genres ? (
              <div className="flex gap-4">
                {movieInfo.genres.map((u, index) => (
                  <p
                    key={index}
                    className="inline-block w-max px-2 outline-1 outline-gray-300 rounded-4xl"
                  >
                    {u.genre_name + " "}
                  </p>
                ))}
              </div>
            ) : null}
            <p className="text-xl font-bold">⭐ {movieInfo.rating || 0}</p>
            <div className="flex-1 pt-10 max-w-[70%]">
              <h2 className="text-2xl font-bold ">Description:</h2>
              <article className="italic mt-6">{movieInfo.description}</article>
            </div>
            <div>
              <h2 className="text-2xl font-bold mt-4">Cast:</h2>
              <article className="italic mt-6">{movieInfo.cast}</article>
            </div>
          </div>
        </div>
        <hr className="mt-10" />
        <div className="flex flex-col pt-10 gap-y-4 max-w-[70%]">
          <CreateReview movieID={movieInfo.movie_id} />
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
