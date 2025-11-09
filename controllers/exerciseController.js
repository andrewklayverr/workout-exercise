const Exercise = require('../models/Exercise');

exports.createExercise = async (req, res) => {
  try {
    const { name, day, sets, reps } = req.body;
    const exercise = new Exercise({ name, day, sets, reps });
    await exercise.save();
    res.status(201).json(exercise);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar exercício' });
  }
};

exports.getExercisesByDay = async (req, res) => {
  try {
    const { day } = req.params;
    const exercises = await Exercise.find({ day });
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar exercícios' });
  }
};
