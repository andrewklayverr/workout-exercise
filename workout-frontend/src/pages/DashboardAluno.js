import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";


const DashboardAluno = () => {
  const { user } = useContext(AuthContext);
  const [exercises, setExercises] = useState([]);
  const [selectedDay, setSelectedDay] = useState("A");

  useEffect(() => {
    if (user) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/exercises?userId=${user.id}&day=${selectedDay}`)
        .then((res) => setExercises(res.data))
        .catch((err) => console.error("Erro ao buscar exercícios:", err));
    }
  }, [user, selectedDay]);

  return (
    <div className="dashboard-aluno">
      <h2> Bem-vindo ao seu painel de treinos</h2>

      <div className="day-selector">
        {["A", "B", "C", "D"].map((day) => (
          <button
            key={day}
            className={selectedDay === day ? "active" : ""}
            onClick={() => setSelectedDay(day)}
          >
            Treino {day}
          </button>
        ))}
      </div>

      <div className="exercise-list">
        {exercises.length === 0 ? (
          <p>Nenhum exercício cadastrado para o treino {selectedDay}.</p>
        ) : (
          exercises.map((ex) => (
            <div key={ex._id} className="exercise-card">
              <h3>{ex.name}</h3>
              <p><strong>Séries:</strong> {ex.sets} | <strong>Repetições:</strong> {ex.reps}</p>
              {ex.description && <p>{ex.description}</p>}
              {ex.mediaUrl && (
                <a href={ex.mediaUrl} target="_blank" rel="noreferrer">
                  📹 Ver vídeo
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardAluno;
