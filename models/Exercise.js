const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  day: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true }
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
