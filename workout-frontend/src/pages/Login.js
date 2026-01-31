import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api"; // ✅ usa a baseURL correta
import "../styles/Login.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === "personal" ? "/personal" : "/");
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao fazer login.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Entrar</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="auth-button" type="submit">Entrar</button>
        {error && <p className="auth-error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
