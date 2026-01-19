import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/CheckinHistory.css';

const formatTime = (seconds) => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const formatDate = (iso) => {
  return new Date(iso).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  });
};

const CheckinPage = () => {
  const [checkins, setCheckins] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [day] = useState('A');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchCheckins = async () => {
    try {
      const res = await api.get('/workouts/checkin/history');
      setCheckins(res.data);
    } catch (err) {
      console.error('Erro ao buscar check-ins:', err);
    }
  };

  useEffect(() => {
    fetchCheckins();
  }, []);

  const startTimer = () => {
    const now = Date.now();
    setStartTime(now);
    setIsRunning(true);
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - now) / 1000));
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = async () => {
    clearInterval(intervalId);
    setIsRunning(false);

    try {
      await api.post('/workouts/checkin', {
        day,
        duration: elapsed,
        startedAt: new Date(startTime).toISOString(),
        endedAt: new Date().toISOString()
      });
      setSuccessMessage('✅ Check-in salvo com sucesso!');
      fetchCheckins();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Erro ao salvar check-in:', err);
    }

    setElapsed(0);
    setStartTime(null);
  };

  return (
    <div className="checkin-history">
      <h2>Check-in do Treino</h2>
      <p className="tempo">{formatTime(elapsed)}</p>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {!isRunning ? (
        <button onClick={startTimer} className="btn-iniciar">✅ Iniciar Check-in</button>
      ) : (
        <button onClick={stopTimer} className="btn-finalizar">🛑 Finalizar</button>
      )}

      <hr style={{ margin: '2rem 0', borderColor: '#444' }} />

      <h2>📋 Histórico de Check-ins</h2>
      {checkins.length === 0 ? (
        <p>Nenhum check-in registrado ainda.</p>
      ) : (
        <ul className="checkin-list">
          {checkins.map((item) => (
            <li key={item._id} className="checkin-item">
              <strong>Treino {item.day}</strong><br />
              ⏱️ Duração: {formatTime(item.duration)}<br />
              🕒 Início: {formatDate(item.startedAt)}<br />
              🛑 Fim: {formatDate(item.endedAt)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CheckinPage;
