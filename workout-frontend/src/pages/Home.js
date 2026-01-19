import React from "react";
import WorkoutSelector from "./WorkoutSelector";
import ProgressDashboard from "./ProgressDashboard";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container">

      <WorkoutSelector />
      <ProgressDashboard />

     
     
    </div>
  );
};

export default Home;
