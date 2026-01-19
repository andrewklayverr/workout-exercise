const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');

// Salvar histórico de treino
router.post('/', async (req, res) => {
  try {
    const { exerciseId, day } = req.body;

    const workout = new Workout({ exerciseId, day: day.toUpperCase() });
    await workout.save();

    res.status(201).json(workout);
  } catch (err) {
    console.error('Erro ao salvar histórico:', err);
    res.status(400).json({ error: err.message });
  }
});

// Buscar histórico por dia
router.get('/:day', async (req, res) => {
  try {
    const dayParam = req.params.day.toUpperCase();

    const history = await Workout.find({ day: dayParam })
      .populate('exerciseId'); // traz os dados do exercício

    res.json(history);
  } catch (err) {
    console.error('Erro ao buscar histórico:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
