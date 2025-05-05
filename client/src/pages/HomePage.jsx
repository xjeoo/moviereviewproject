import React from "react";
import { useAuth } from "../context/authContext";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

const HomePage = () => {
  const auth = useAuth();

  return (
    <>
      <Navbar username={auth.data?.username} />
      <div className="w-dvw h-full px-10 py-8 flex gap-5">
        <MovieCard
          name={"Matrix"}
          route={"https://i.ibb.co/GQ6wrRS7/71-Pf-ZFFz9y-L-AC-SL1000.jpg"}
        />
        <MovieCard
          name={"Gladiator"}
          route={
            "https://i.ibb.co/zhyVS0yZ/MV5-BYWQ4-Ym-Nj-Yj-Et-OWE1-Zi00-Y2-U4-LWI4-NTAt-MTU0-Mjkx-NWQ1-Zm-Ji-Xk-Ey-Xk-Fqc-Gc-V1.jpg"
          }
        />
        <MovieCard
          name={"Matrix"}
          route={"https://i.ibb.co/GQ6wrRS7/71-Pf-ZFFz9y-L-AC-SL1000.jpg"}
        />
        <MovieCard
          name={"Gladiator"}
          route={
            "https://i.ibb.co/zhyVS0yZ/MV5-BYWQ4-Ym-Nj-Yj-Et-OWE1-Zi00-Y2-U4-LWI4-NTAt-MTU0-Mjkx-NWQ1-Zm-Ji-Xk-Ey-Xk-Fqc-Gc-V1.jpg"
          }
        />
      </div>
    </>
  );
};

export default HomePage;
