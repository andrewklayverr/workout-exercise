import React, { useState } from 'react';
import ExerciseList from './ExerciseList';
import '../styles/MuscleGroupList.css';

const muscleGroupsByDay = {
  A: ['Peito', 'Ombro (deltoide anterior)', 'Deltoide lateral', 'Tríceps'],
  B: ['Costas (latíssimo)', 'Trapézio', 'Deltoide posterior', 'Lombar', 'Bíceps', 'Antebraço'],
  C: ['Quadríceps', 'Posterior (isquiotibiais)', 'Panturrilha', 'Glúteos', 'Adutores', 'Abdutores'],
  D: ['Abdômen reto', 'Oblíquos', 'Core', 'Cardio']
};


const groupTags = {
  'Peito': 'peito',
  'Ombro (deltoide anterior)': 'ombro',
  'Deltoide lateral': 'ombro',
  'Tríceps': 'triceps',
  'Costas (latíssimo)': 'costas',
  'Trapézio': 'costas',
  'Deltoide posterior': 'ombro',
  'Lombar': 'costas',
  'Bíceps': 'biceps',
  'Antebraço': 'biceps',
  'Quadríceps': 'pernas',
  'Posterior (isquiotibiais)': 'pernas',
  'Panturrilha': 'pernas',
  'Glúteos': 'pernas',
  'Adutores': 'pernas',
  'Abdutores': 'pernas',
  'Abdômen reto': 'abdomen',
  'Oblíquos': 'abdomen',
  'Core': 'abdomen',
  'Cardio': 'cardio'
};

const MuscleGroupList = ({ day }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleSelectGroup = (group) => {
    setSelectedGroup(group === selectedGroup ? null : group);
  };

  const groups = muscleGroupsByDay[day] || [];

  return (
    <div>
      <h2>Grupos musculares do treino {day}</h2>
      <div className="grupo-muscular-grid">
        {groups.map((group) => (
          <button
            key={group}
            onClick={() => handleSelectGroup(group)}
            className={`grupo-btn ${groupTags[group]} ${selectedGroup === group ? 'selected' : ''}`}
          >
            {group}
          </button>
        ))}
      </div>

      {selectedGroup && (
        <div style={{ marginTop: '2rem' }}>
          <ExerciseList day={day} group={selectedGroup} />
        </div>
      )}
    </div>
  );
};

export default MuscleGroupList;
