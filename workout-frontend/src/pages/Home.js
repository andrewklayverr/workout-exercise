import React, { useContext } from "react";
import WorkoutSelector from "./WorkoutSelector";
import ProgressDashboard from "./ProgressDashboard";
import { AuthContext } from "../context/AuthContext";
import "../styles/Home.css";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="home-container">
      <WorkoutSelector userId={user?.id} />
      <ProgressDashboard userId={user?.id} />
    </div>
  );
};

export default Home;
