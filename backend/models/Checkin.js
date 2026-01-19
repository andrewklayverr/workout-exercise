const mongoose = require('mongoose');

const CheckinHistorySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // segundos
    required: true
  },
  startedAt: {
    type: Date,
    required: true
  },
  endedAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Checkin', CheckinHistorySchema);

