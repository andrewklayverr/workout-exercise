import React, { useState, useEffect, useContext } from "react";
import MuscleGroupList from "./MuscleGroupList";
import axios from "axios";
import "../styles/WorkoutSelector.css";
import { AuthContext } from "../context/AuthContext";

const WorkoutSelector = () => {
  const { user } = useContext(AuthContext);
  const [selectedDay, setSelectedDay] = useState(null);
  const [exercises, setExercises] = useState([]);
  const days = ["A", "B", "C", "D"];

  const handleSelect = (day) => {
    setSelectedDay((prev) => (prev === day ? null : day));
  };

  useEffect(() => {
    const fetchExercises = async () => {
      if (!user || !selectedDay) return;

      try {
        const params = { day: selectedDay };

        if (user.role === "aluno") {
          params.alunoId = user.id;
        } else if (user.role === "personal") {
          params.personalId = user.id;
        }

        const res = await axios.get(`${process.env.REACT_APP_API_URL}/exercises`, { params });
        setExercises(res.data);
      } catch (err) {
        console.error("Erro ao buscar exercícios:", err);
      }
    };

    fetchExercises();
  }, [user, selectedDay]);

  return (
    <div className="workout-selector">
      <h1 className="titulo">Escolha seu treino</h1>

      <div className="button-grid">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => handleSelect(day)}
            className={`treino-btn ${selectedDay === day ? "selected" : ""}`}
          >
            Treino {day}
          </button>
        ))}
      </div>

      {selectedDay && (
        <div className="muscle-group-container">
          <MuscleGroupList day={selectedDay} exercises={exercises} />
        </div>
      )}
    </div>
  );
};

export default WorkoutSelector;
