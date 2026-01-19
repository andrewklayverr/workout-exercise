const mongoose = require('mongoose');

const WorkoutHistorySchema = new mongoose.Schema({
  exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
  day: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WorkoutHistory', WorkoutHistorySchema);

