const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  day: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
  muscleGroup: {
    type: String,
    enum: [
      'Peito',
      'Ombro (deltoide anterior)',
      'Deltoide lateral',
      'Deltoide posterior',
      'Tríceps',
      'Costas (latíssimo)',
      'Trapézio',
      'Lombar',
      'Bíceps',
      'Antebraço',
      'Quadríceps',
      'Posterior',
      'Panturrilha',
      'Glúteos',
      'Adutores',
      'Abdutores',
      'Abdômen reto',
      'Oblíquos',
      'Core',
      'Cardio'
    ],
    required: true
  },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  mediaUrl: String,
  description: String
});

module.exports = mongoose.model('Exercise', ExerciseSchema);

