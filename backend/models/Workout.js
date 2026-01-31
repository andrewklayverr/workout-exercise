const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',   
    required: true
  },
  day: {
    type: String,
    enum: ['A', 'B', 'C', 'D'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Workout', WorkoutSchema);

