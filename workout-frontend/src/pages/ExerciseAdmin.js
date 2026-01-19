import React, { useState } from "react";
import api from "../services/api";
import "../styles/ExerciseAdmin.css";

const muscleGroupsByDay = {
  A: ['Peito', 'Ombro (deltoide anterior)', 'Deltoide lateral', 'Tríceps'],
  B: ['Costas (latíssimo)', 'Trapézio', 'Deltoide posterior', 'Lombar', 'Bíceps', 'Antebraço'],
  C: ['Quadríceps', 'Posterior (isquiotibiais)', 'Panturrilha', 'Glúteos', 'Adutores', 'Abdutores'],
  D: ['Abdômen reto', 'Oblíquos', 'Core', 'Cardio']
};

const ExerciseAdmin = () => {
  const [form, setForm] = useState({
    name: "",
    day: "",
    sets: "",
    reps: "",
    mediaUrl: "",
    description: "",
    muscleGroup: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      day: value,
      muscleGroup: "" // limpa grupo ao trocar dia
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, day, sets, reps, mediaUrl, description, muscleGroup } = form;

    if (!name || !day || !sets || !reps || !muscleGroup) {
      setMessage("❌ Preencha todos os campos obrigatórios.");
      return;
    }

    const newExercise = {
      name,
      day: day.toUpperCase(),
      sets: parseInt(sets),
      reps: parseInt(reps),
      mediaUrl,
      description,
      muscleGroup,
    };

    try {
      await api.post("/exercises", newExercise);
      setMessage("✅ Exercício cadastrado com sucesso!");
      setForm({
        name: "",
        day: "",
        sets: "",
        reps: "",
        mediaUrl: "",
        description: "",
        muscleGroup: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ Erro ao cadastrar exercício.");
    }
  };

  return (
    <div className="admin-container">
      <h2>📋 Cadastro de Exercício</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <label>Nome do exercício*</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Dia (A, B, C, D)*</label>
        <select name="day" value={form.day} onChange={handleDayChange} required>
          <option value="">Selecione</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>

        <label>Grupo muscular*</label>
        <select
          name="muscleGroup"
          value={form.muscleGroup}
          onChange={handleChange}
          disabled={!form.day}
          required
        >
          <option value="">Selecione</option>
          {form.day &&
            muscleGroupsByDay[form.day].map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
        </select>

        <label>Séries*</label>
        <input
          name="sets"
          type="number"
          value={form.sets}
          onChange={handleChange}
          required
        />

        <label>Repetições*</label>
        <input
          name="reps"
          type="number"
          value={form.reps}
          onChange={handleChange}
          required
        />

        <label>URL da imagem ou vídeo</label>
        <input name="mediaUrl" value={form.mediaUrl} onChange={handleChange} />

        <label>Descrição</label>
        <textarea
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit">Salvar exercício</button>
      </form>

      {message && <p className="admin-message">{message}</p>}
    </div>
  );
};

export default ExerciseAdmin;
