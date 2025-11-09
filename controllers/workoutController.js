const WorkoutHistory = require('../models/WorkoutHistory');

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
