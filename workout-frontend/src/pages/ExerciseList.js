import React, { useEffect, useState, useCallback, useContext } from 'react';
import api from '../services/api';
import '../styles/ExerciseList.css';
import useWorkoutStore from '../store/useWorkoutStore';
import { AuthContext } from "../context/AuthContext";

function ExerciseList({ day, group }) {
  const { user } = useContext(AuthContext);
  const [exercises, setExercises] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [history, setHistory] = useState([]);
  const incrementStat = useWorkoutStore((state) => state.incrementStat);

  const fetchHistory = useCallback(() => {
    if (!user?.id) return;

    api.get(`/workouts/${day}?userId=${user.id}`)
      .then(res => {
        const today = new Date().toISOString().slice(0, 10);
        const todayHistory = res.data.filter(item => {
          const itemDate = new Date(item.date).toISOString().slice(0, 10);
          return itemDate === today;
        });

        setHistory(todayHistory);
        setCompleted(todayHistory.map(item => item.exerciseId?._id));
      })
      .catch(err => console.error('Erro ao buscar histórico:', err));
  }, [day, user]);

  useEffect(() => {
    if (!day || !group || !user?.id) return;

    const fetchExercises = async () => {
      try {
        const params = { day, group };

        if (user.role === "aluno") {
          params.alunoId = user.id;
        } else if (user.role === "personal") {
          params.personalId = user.id;
        }

        const res = await api.get("/exercises", { params });
        setExercises(res.data);
        console.log("Exercícios carregados:", res.data);
      } catch (err) {
        console.error("Erro ao buscar exercícios:", err);
      }
    };

    fetchExercises();
    fetchHistory();
  }, [day, group, user, fetchHistory]);

  const handleComplete = async (id) => {
    try {
      await api.post('/workouts', { exerciseId: id, day, userId: user.id });
      setCompleted(prev => [...prev, id]);
      fetchHistory();
      incrementStat(day);
    } catch (err) {
      console.error('Erro ao salvar histórico:', err.response?.data || err);
    }
  };

  return (
    <div className="exercise-list-container">
      <h3>Exercícios de {group} – Treino {day}</h3>

      {exercises.length === 0 ? (
        <p>Nenhum exercício cadastrado para este grupo.</p>
      ) : (
        <div className="exercise-grid">
          {exercises.map(ex => (
            <div
              key={ex._id}
              className={`exercise-card ${completed.includes(ex._id) ? 'completed' : ''}`}
            >
              <h4>{ex.name}</h4>
              <p>{ex.sets}x{ex.reps}</p>

              {ex.mediaUrl && (
                ex.mediaUrl.includes('.mp4') ? (
                  <video width="100%" controls>
                    <source src={ex.mediaUrl} type="video/mp4" />
                    Seu navegador não suporta vídeo.
                  </video>
                ) : (
                  <img src={ex.mediaUrl} alt={ex.name} style={{ width: '100%' }} />
                )
              )}

              <p>{ex.description || `Este exercício trabalha o grupo de ${group.toLowerCase()}.`}</p>

              {!completed.includes(ex._id) && (
                <button onClick={() => handleComplete(ex._id)} className="btn-concluir">✅ Concluir</button>
              )}

              {completed.includes(ex._id) && <span className="check-icon">✔️</span>}
            </div>
          ))}
        </div>
      )}

      <h3 className="history-title">Histórico do Treino {day}</h3>
      {history.length === 0 ? (
        <p>Nenhum treino concluído ainda.</p>
      ) : (
        <ul className="history-list">
          {history.map(item => (
            <li key={item._id} className="history-item">
              <strong>{item.exerciseId?.name || 'Exercício'}</strong><br />
              {item.exerciseId?.sets}x{item.exerciseId?.reps}<br />
              <span className="history-date">
                Concluído em {new Date(item.date).toLocaleDateString('pt-BR')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExerciseList;
