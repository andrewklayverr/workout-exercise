import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/ProgressDashboard.css";
import useWorkoutStore from "../store/useWorkoutStore";

const ProgressDashboard = () => {
  const stats = useWorkoutStore((state) => state.stats);
  const setStats = useWorkoutStore((state) => state.setStats);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/workouts/today/summary');
        setStats(res.data);

        const days = ['A', 'B', 'C', 'D'];
        const todayHistory = (await Promise.all(
          days.map(day => api.get(`/workouts/${day}`))
        ))
          .flatMap(r => r.data)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        setHistory(todayHistory);
      } catch (err) {
        console.error("Erro ao buscar estatísticas:", err);
      }
    };

    fetchStats();
  }, [setStats]);

  const totalPorTreino = 6;

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">📊 Progresso dos Treinos</h2>

      <div className="cards-container">
        {Object.entries(stats).map(([day, count]) => (
          <div key={day} className="card">
            <h3 className="card-title">Treino {day}</h3>
            <p className="card-subtitle">{count} exercícios concluídos</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${Math.min((count / totalPorTreino) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="history-title">🕒 Últimos exercícios concluídos</h3>
      <ul className="history-list">
        {history.map(item => (
          <li key={item._id} className="history-item">
            <span>
              <strong>{item.exerciseId?.name}</strong> — {item.exerciseId?.sets}x{item.exerciseId?.reps}
            </span>
            <span className="history-date">
              {new Date(item.date).toLocaleDateString("pt-BR")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressDashboard;
