
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";

import ExerciseAdmin from "./pages/ExerciseAdmin";
import "./App.css";
import CheckinPage from './pages/CheckinPage';





function App() {
  return (
    <Router>
        <nav>
        <nav className="navbar">
          <Link to="/" className="nav-link">
            🏋️ Treinos
          </Link>
          <Link to="/Checkin" className="nav-link">
            📝 Checkin do Treino
          </Link>
          <Link to="/admin" className="nav-link">
            ⚙️ Admin
          </Link>
        </nav>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<ExerciseAdmin />} />
        <Route path="/Checkin" element={<CheckinPage />} />
      </Routes>
    </Router>
  );
}

export default App;
