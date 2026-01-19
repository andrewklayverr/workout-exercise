import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import '../styles/ExerciseList.css';

function ExerciseList({ day, group }) {
  const [exercises, setExercises] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [history, setHistory] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchHistory = useCallback(() => {
    api.get(`/workouts/${day}`)
      .then(res => {
        setHistory(res.data);
        setCompleted(res.data.map(item => item.exerciseId?._id));
      })
      .catch(err => console.error('Erro ao buscar histórico:', err));
  }, [day]);

  useEffect(() => {
    if (!day || !group) return;

    api.get(`/exercises?day=${day}&group=${group}`)
      .then(res => setExercises(res.data))
      .catch(err => console.error('Erro ao buscar exercícios:', err));

    fetchHistory();
  }, [day, group, fetchHistory]);

  const handleComplete = async (id) => {
    try {
      await api.post('/workouts', { exerciseId: id, day });
      setCompleted(prev => [...prev, id]);
      fetchHistory();
    } catch (err) {
      console.error('Erro ao salvar histórico:', err.response?.data || err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/exercises/${id}`);
      setExercises(prev => prev.filter(ex => ex._id !== id));
    } catch (err) {
      console.error('Erro ao deletar exercício:', err);
    }
  };

  const handleEditClick = (exercise) => {
    setEditingId(exercise._id);
    setEditForm({
      name: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      description: exercise.description || '',
      mediaUrl: exercise.mediaUrl || ''
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await api.put(`/exercises/${id}`, editForm);
      setExercises(prev => prev.map(ex => (ex._id === id ? res.data : ex)));
      setEditingId(null);
    } catch (err) {
      console.error('Erro ao salvar edição:', err);
    }
  };

  return (
    <div className="exercise-list-container">
      <h3>Exercícios de {group} – Treino {day}</h3>
      <div className="exercise-grid">
        {exercises.map(ex => (
          <div
            key={ex._id}
            className={`exercise-card ${completed.includes(ex._id) ? 'completed' : ''}`}
          >
            {editingId === ex._id ? (
              <>
                <input name="name" value={editForm.name} onChange={handleEditChange} />
                <input name="sets" type="number" value={editForm.sets} onChange={handleEditChange} />
                <input name="reps" type="number" value={editForm.reps} onChange={handleEditChange} />
                <textarea name="description" value={editForm.description} onChange={handleEditChange} />
                <input name="mediaUrl" value={editForm.mediaUrl} onChange={handleEditChange} />

                <div className="button-group">
                  <button onClick={() => handleSaveEdit(ex._id)} className="btn-salvar">💾 Salvar</button>
                  <button onClick={() => setEditingId(null)} className="btn-cancelar">❌ Cancelar</button>
                </div>
              </>
            ) : (
              <>
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

                <div className="button-group">
                  {!completed.includes(ex._id) && (
                    <button onClick={() => handleComplete(ex._id)} className="btn-concluir">✅ Concluir</button>
                  )}
                  <button onClick={() => handleEditClick(ex)} className="btn-editar">✏️ Editar</button>
                  <button onClick={() => handleDelete(ex._id)} className="btn-deletar">🗑️ Deletar</button>
                </div>
              </>
            )}

            {completed.includes(ex._id) && (
              <span className="check-icon">✔️</span>
            )}
          </div>
        ))}
      </div>

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
