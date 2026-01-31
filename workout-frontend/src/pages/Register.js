import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; 
import "../styles/Register.css";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "aluno"
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao registrar.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Criar Conta</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Nome"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Senha"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="aluno">Aluno</option>
          <option value="personal">Personal</option>
        </select>
        <button className="auth-button" type="submit">Cadastrar</button>
        {error && <p className="auth-error">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
