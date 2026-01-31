import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import ExerciseAdmin from "./pages/ExerciseAdmin";
import TemporizadorPage from "./pages/TermporizadorPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardAluno from "./pages/DashboardAluno";
import DashboardPersonal from "./pages/DashboardPersonal";

import Loading from "./components/Loading";
import Header from "./components/Header";
import "./App.css";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function AppContent() {
  const { loading } = useContext(AuthContext);

  if (loading) return <Loading />;

  return (
    <>
      <Header />

      <Routes>
        {/* Rotas públicas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/Temporizador" element={<TemporizadorPage />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute role={["aluno", "personal"]}>
              <ExerciseAdmin />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas protegidas */}
        <Route
          path="/aluno"
          element={
            <PrivateRoute role="aluno">
              <DashboardAluno />
            </PrivateRoute>
          }
        />
        <Route
          path="/personal"
          element={
            <PrivateRoute role="personal">
              <DashboardPersonal />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  console.log("API URL em uso:", process.env.REACT_APP_API_URL);

  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
