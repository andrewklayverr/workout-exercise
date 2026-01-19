import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/ProgressDashboard.css";

const ProgressDashboard = () => {
  const [stats, setStats] = useState({ A: 0, B: 0, C: 0, D: 0 });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const days = ["A", "B", "C", "D"];
        const newStats = {};
        for (const day of days) {
          const res = await api.get(`/workouts/${day}`);
          newStats[day] = res.data.length;
        }
        setStats(newStats);

        const allHistory = (await Promise.all(days.map(d => api.get(`/workouts/${d}`))))
          .flatMap(r => r.data)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        setHistory(allHistory);
      } catch (err) {
        console.error("Erro ao buscar estatísticas:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">📊 Progresso dos Treinos</h2>

      {/* Cards horizontais roláveis */}
      <div className="cards-container">
        {Object.entries(stats).map(([day, count]) => (
          <div key={day} className="card">
            <h3 className="card-title">Treino {day}</h3>
            <p className="card-subtitle">{count} exercícios concluídos</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(count * 10, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Histórico */}
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
