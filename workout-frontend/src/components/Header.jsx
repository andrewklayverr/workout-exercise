import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Header.css";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="header">
      <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>🏋️ MyGym</Link>

      <button
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Abrir menu"
      >
        <span className="bar top" />
        <span className="bar middle" />
        <span className="bar bottom" />
      </button>

      <nav ref={navRef} className={`nav ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Treinos</Link>
        <Link to="/temporizador" className="nav-link" onClick={() => setMenuOpen(false)}>Temporizador</Link>

        {(user?.role === "aluno" || user?.role === "personal") && (
          <Link to="/admin" className="nav-link" onClick={() => setMenuOpen(false)}>Criar Treino</Link>
        )}

        {!user ? (
          <>
            <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" className="nav-link" onClick={() => setMenuOpen(false)}>Cadastro</Link>
          </>
        ) : (
          <>
            <span className="nav-user">{user.name}</span>
            <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="btn-logout">Sair</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
