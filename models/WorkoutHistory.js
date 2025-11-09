const mongoose = require('mongoose');

const WorkoutHistorySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  day: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
  completedExercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }]
});

module.exports = mongoose.model('WorkoutHistory', WorkoutHistorySchema);
