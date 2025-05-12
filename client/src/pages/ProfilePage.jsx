import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [reviewedMovies, setReviewedMovies] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const userInfoRoute = "http://localhost:3000/users?id=";
  const partialRoute = "http://localhost:3000/users";
  // + "/id/reviews"
  useEffect(() => {
    axios
      .get(userInfoRoute + id.toString())
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err.response?.data);
      });
  }, []);

  useEffect(() => {
    if (user) {
      axios
        .get(partialRoute + `/${user.user_id}/reviews`)
        .then((res) => {
          setReviewedMovies(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err.response?.data);
        });
    }
  }, [user]);

  return (
    <>
      <Navbar />
      {!isLoading ? (
        <div className="w-full min-h-dvh px-15 py-6">
          <div className="w-full h-fit flex flex-col gap-6 outline-1 outline-amber-50 rounded-4xl px-16 py-16">
            <h1 className="text-4xl font-bold">{user.username}</h1>
            <h2 className="text-3xl py-10">Reviewed movies:</h2>
            <div className="flex basis-[100%] flex-wrap gap-10">
              {reviewedMovies.map((r) => (
                <MovieCard path={r.path} key={r.path} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default ProfilePage;
