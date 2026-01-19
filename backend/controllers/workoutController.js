const WorkoutHistory = require('../models/WorkoutHistory');
const Checkin = require('../models/Checkin');

// Salvar exercícios concluídos
exports.saveWorkout = async (req, res) => {
  try {
    const { day, completedExercises } = req.body;

    const workout = new WorkoutHistory({
      day,
      completedExercises
    });

    await workout.save();
    res.status(201).json(workout);
  } catch (err) {
    console.error('Erro ao salvar treino:', err);
    res.status(500).json({ error: 'Erro ao salvar treino' });
  }
};


exports.getWorkoutHistory = async (req, res) => {
  try {
    const history = await WorkoutHistory.find().populate('completedExercises');
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar histórico de treinos' });
  }
};

exports.saveCheckin = async (req, res) => {
  try {
    const { day, duration, startedAt, endedAt } = req.body;

    const checkin = new CheckinHistory({
      day,
      duration,
      startedAt,
      endedAt
    });

    await checkin.save();
    res.status(201).json(checkin);
  } catch (err) {
    console.error('Erro ao salvar check-in:', err);
    res.status(500).json({ error: 'Erro ao salvar check-in' });
  }
};


exports.getCheckinHistory = async (req, res) => {
  try {
    const history = await CheckinHistory.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar histórico de check-ins' });
  }
};
