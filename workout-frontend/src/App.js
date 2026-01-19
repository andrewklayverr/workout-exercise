import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import RegisterWorkout from "./pages/RegisterWorkout";
import ExerciseAdmin from "./pages/ExerciseAdmin";
import "./App.css";

function App() {
  return (
    <Router>
        <nav
        
        >
        <nav className="navbar">
          <Link to="/" className="nav-link">
            🏋️ Treinos
          </Link>
          <Link to="/register" className="nav-link">
            📝 Registrar
          </Link>
          <Link to="/admin" className="nav-link">
            ⚙️ Admin
          </Link>
        </nav>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterWorkout />} />
        <Route path="/admin" element={<ExerciseAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
