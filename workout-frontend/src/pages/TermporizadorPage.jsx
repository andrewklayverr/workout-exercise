import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/CheckinHistory.css';
import { AuthContext } from '../context/AuthContext';

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

const  TemporizadorPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [checkins, setCheckins] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [day, setDay] = useState('A');
  const [successMessage, setSuccessMessage] = useState('');

  // Protege a rota
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // Limpa o cronômetro ao desmontar
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

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

    const savedStart = localStorage.getItem('checkinStart');
    const savedDay = localStorage.getItem('checkinDay');

    if (savedStart && savedDay) {
      const start = parseInt(savedStart);
      setStartTime(start);
      setDay(savedDay);
      setIsRunning(true);
      const id = setInterval(() => {
        setElapsed(Math.floor((Date.now() - start) / 1000));
      }, 1000);
      setIntervalId(id);
    }
  }, []);

  const startTimer = () => {
    if (isRunning) return;

    const now = Date.now();
    setStartTime(now);
    setIsRunning(true);
    localStorage.setItem('checkinStart', now);
    localStorage.setItem('checkinDay', day);

    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - now) / 1000));
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = async () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    const finalElapsed = Math.floor((Date.now() - startTime) / 1000);

    setIsRunning(false);
    setElapsed(0);
    setStartTime(null);
    localStorage.removeItem('checkinStart');
    localStorage.removeItem('checkinDay');

    try {
      await api.post('/workouts/checkin', {
        day,
        duration: finalElapsed,
        startedAt: new Date(startTime).toISOString(),
        endedAt: new Date().toISOString()
      });
      setSuccessMessage('✅ Check-in salvo com sucesso!');
      fetchCheckins();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Erro ao salvar check-in:', err);
    }
  };

  return (
    <div className="checkin-history">
      <h2>Temporizador de Treino</h2>

      <label htmlFor="day-select">Selecione o dia do treino:</label>
      <select
        id="day-select"
        value={day}
        onChange={(e) => setDay(e.target.value)}
        disabled={isRunning}
      >
        <option value="A">Treino A</option>
        <option value="B">Treino B</option>
        <option value="C">Treino C</option>
        <option value="D">Treino D</option>
      </select>

      <p className="tempo">{formatTime(elapsed)}</p>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {!isRunning ? (
        <button onClick={startTimer} className="btn-iniciar"> Iniciar Temporizador </button>
      ) : (
        <button onClick={stopTimer} className="btn-finalizar"> Finalizar</button>
      )}

      <hr style={{ margin: '2rem 0', borderColor: '#444' }} />

      <h2>Histórico de Temporizador</h2>
      {checkins.length === 0 ? (
        <p>Nenhum cronometro registrado ainda.</p>
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

export default TemporizadorPage;
