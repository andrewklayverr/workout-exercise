import React, { useState } from 'react';
import MuscleGroupList from './MuscleGroupList';
import '../styles/WorkoutSelector.css';

const WorkoutSelector = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const days = ['A', 'B', 'C', 'D'];

  const handleSelect = (day) => {
    // se clicar no mesmo treino, desmarca
    setSelectedDay((prev) => (prev === day ? null : day));
  };

  return (
    <div className="workout-selector">
      <h1 className="titulo">Escolha seu treino</h1>

      <div className="button-grid">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => handleSelect(day)}
            className={`treino-btn ${selectedDay === day ? 'selected' : ''}`}
          >
            Treino {day}
          </button>
        ))}
      </div>

      {selectedDay && (
        <div className="muscle-group-container">
          <MuscleGroupList day={selectedDay} />
        </div>
      )}
    </div>
  );
};

export default WorkoutSelector;
