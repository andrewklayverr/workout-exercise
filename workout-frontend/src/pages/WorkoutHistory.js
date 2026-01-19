import React, { useEffect, useState } from "react";
import api from "../services/api";

const WorkoutHistory = ({ day }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api
      .get(`/workouts/${day}`)
      .then((res) => {
        console.log("Histórico recebido:", res.data);
        setHistory(res.data);
      })
      .catch((err) => console.error("Erro ao buscar histórico:", err));
  }, [day]);

  return (
    <div style={{ padding: "1rem" }}>
      <h3>Histórico do Treino {day}</h3>
      {history.length === 0 ? (
        <p>Nenhum treino concluído ainda.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {history.map((item) => (
            <li key={item._id} style={{ marginBottom: "1rem" }}>
              <strong>{item.exerciseId?.name || "Exercício sem nome"}</strong>
              <br />
              {item.exerciseId?.sets}x{item.exerciseId?.reps}
              <br />
              <span style={{ fontSize: "0.9rem", color: "#555" }}>
                Concluído em {new Date(item.date).toLocaleDateString("pt-BR")}
              </span>
              <br />
              {item.exerciseId?.sets}x{item.exerciseId?.reps}
              <br />
              <span style={{ fontSize: "0.9rem", color: "#555" }}>
                Concluído em {new Date(item.date).toLocaleDateString("pt-BR")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorkoutHistory;
