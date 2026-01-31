import React, { useState, useEffect, useContext } from "react";
import api from "../services/api";
import "../styles/ExerciseAdmin.css";
import { exerciseLibrary } from "../data/exerciseLibrary";
import Select from "react-select";
import { AuthContext } from "../context/AuthContext";

const muscleGroupsByDay = {
  A: ["Peito", "Ombro (deltoide anterior)", "Deltoide lateral", "Tríceps"],
  B: ["Costas (latíssimo)", "Trapézio", "Deltoide posterior", "Lombar", "Bíceps", "Antebraço"],
  C: ["Quadríceps", "Posterior", "Panturrilha", "Glúteos", "Adutores", "Abdutores"],
  D: ["Abdômen reto", "Oblíquos", "Core", "Cardio"]
};

const dayOptions = ["A", "B", "C", "D"].map((d) => ({ value: d, label: d }));

const customStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    fontSize: "0.95rem",
    padding: "2px",
    boxShadow: "none",
    "&:hover": { borderColor: "#2196f3" }
  }),
  menu: (base) => ({
    ...base,
    maxHeight: "200px",
    overflowY: "auto",
    zIndex: 10
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#e3f2fd" : "#fff",
    color: "#333",
    fontSize: "0.95rem",
    cursor: "pointer"
  }),
  singleValue: (base) => ({
    ...base,
    color: "#333"
  }),
  placeholder: (base) => ({
    ...base,
    color: "#888"
  })
};

const ExerciseAdmin = () => {
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    day: "",
    muscleGroup: "",
    sets: 3,
    reps: 10,
    mediaUrl: "",
    description: "",
    alunoId: user.role === "aluno" ? user.id : null,
    personalId: user.role === "personal" ? user.id : null
  });

  const [exerciseOptions, setExerciseOptions] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [message, setMessage] = useState("");

  const groupOptions = form.day
    ? muscleGroupsByDay[form.day].map((group) => ({
        value: group,
        label: group
      }))
    : [];

  useEffect(() => {
    if (form.day && form.muscleGroup) {
      api
        .get(`/exercises?day=${form.day}&group=${form.muscleGroup}`)
        .then((res) => {
          const dbExercises = res.data.map((ex) => ex.name);
          const localExercises = exerciseLibrary[form.muscleGroup] || [];
          const combined = [...dbExercises];
          localExercises.forEach((name) => {
            if (!dbExercises.includes(name)) {
              combined.push(name);
            }
          });
          setExerciseOptions(combined);
        })
        .catch(() => {
          setExerciseOptions(exerciseLibrary[form.muscleGroup] || []);
        });
    } else {
      setExerciseOptions([]);
      setSelectedExercise("");
    }
  }, [form.day, form.muscleGroup]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const adjustCounter = (field, delta) => {
    setForm((prev) => ({
      ...prev,
      [field]: Math.max(1, prev[field] + delta)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { day, muscleGroup, sets, reps, mediaUrl, description } = form;

    if (!selectedExercise || !day || !muscleGroup || !sets || !reps) {
      setMessage("❌ Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const res = await api.get(`/exercises?day=${day}&group=${muscleGroup}`);
      const alreadyExists = res.data.some(
        (ex) => ex.name.toLowerCase() === selectedExercise.toLowerCase()
      );

      if (alreadyExists) {
        setMessage("⚠️ Este exercício já foi cadastrado para esse dia e grupo muscular.");
        return;
      }

      const newExercise = {
        name: selectedExercise,
        day: day.toUpperCase(),
        muscleGroup,
        sets: parseInt(sets),
        reps: parseInt(reps),
        mediaUrl,
        description,
        alunoId: user?.role === "aluno" ? user.id : null,
        personalId: user?.role === "personal" ? user.id : null
      };

      await api.post("/exercises", newExercise);
      setMessage("✅ Exercício cadastrado com sucesso!");
      setForm({
        day: "",
        muscleGroup: "",
        sets: 3,
        reps: 10,
        mediaUrl: "",
        description: ""
      });
      setSelectedExercise("");
      setExerciseOptions([]);
    } catch (err) {
      console.error(err);
      setMessage("❌ Erro ao cadastrar exercício.");
    }
  };

  return (
    <div className="admin-container">
      <h2> Cadastro de Exercício</h2>

      {user?.role === "aluno" && (
        <div className="admin-alert">
          Você está criando seu próprio treino. Lembre-se de consultar um profissional para garantir segurança e eficácia nos exercícios.
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        <label>Dia (A, B, C, D)*</label>
        <Select
          options={dayOptions}
          value={form.day ? { value: form.day, label: form.day } : null}
          onChange={(option) =>
            setForm((prev) => ({ ...prev, day: option.value, muscleGroup: "" }))
          }
          placeholder="Selecione o dia"
          styles={customStyles}
          isSearchable={false}
        />

        <label>Grupo muscular*</label>
        <Select
          options={groupOptions}
          value={
            form.muscleGroup
              ? { value: form.muscleGroup, label: form.muscleGroup }
              : null
          }
          onChange={(option) =>
            setForm((prev) => ({ ...prev, muscleGroup: option.value }))
          }
          placeholder="Selecione o grupo muscular"
          styles={customStyles}
          isSearchable
          isDisabled={!form.day}
        />

        <label>Nome do exercício*</label>
        <Select
          options={exerciseOptions.map((name) => ({ label: name, value: name }))}
          value={
            selectedExercise
              ? { label: selectedExercise, value: selectedExercise }
              : null
          }
          onChange={(option) => setSelectedExercise(option.value)}
          placeholder="Selecione um exercício"
          styles={customStyles}
          isSearchable
          isDisabled={!form.day || !form.muscleGroup}
        />

        <label>Séries e Repetições*</label>
        <div className="counter-group">
          <div className="counter">
            <button type="button" onClick={() => adjustCounter("sets", -1)}>-</button>
            <span>{form.sets}</span>
            <button type="button" onClick={() => adjustCounter("sets", 1)}>+</button>
          </div>

          <div className="counter">
            <button type="button" onClick={() => adjustCounter("reps", -1)}>-</button>
            <span>{form.reps}</span>
            <button type="button" onClick={() => adjustCounter("reps", 1)}>+</button>
          </div>
        </div>

        <label>URL da imagem ou vídeo</label>
        <input
          name="mediaUrl"
          value={form.mediaUrl}
          onChange={handleChange}
          placeholder="https://exemplo.com/imagem-ou-video"
        />

        <label>Descrição</label>
        <textarea
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          placeholder="Adicione observações ou instruções específicas..."
        />

        <button type="submit">Salvar exercício</button>
      </form>

      {message && <p className="admin-message">{message}</p>}
    </div>
  );
};

export default ExerciseAdmin;
