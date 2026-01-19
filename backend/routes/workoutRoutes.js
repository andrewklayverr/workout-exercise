const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const Checkin = require('../models/Checkin');

// ✅ ROTA: Salvar check-in com temporizador
router.post('/checkin', async (req, res) => {
  try {
    const { day, duration, startedAt, endedAt } = req.body;

    const checkin = new Checkin({
      day: day.toUpperCase(),
      duration,
      startedAt,
      endedAt
    });

    await checkin.save();
    res.status(201).json(checkin);
  } catch (err) {
    console.error('Erro ao salvar check-in:', err);
    res.status(400).json({ error: err.message });
  }
});


router.get('/checkin/history', async (req, res) => {
  try {
    const history = await Checkin.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    console.error('Erro ao buscar histórico de check-ins:', err);
    res.status(500).json({ error: err.message });
  }
});



router.get('/today/summary', async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayWorkouts = await Workout.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    const summary = { A: 0, B: 0, C: 0, D: 0 };
    todayWorkouts.forEach(w => {
      const day = w.day.toUpperCase();
      if (summary[day] !== undefined) {
        summary[day]++;
      }
    });

    res.json(summary);
  } catch (err) {
    console.error('Erro ao gerar resumo diário:', err);
    res.status(500).json({ error: err.message });
  }
});


router.get('/:day', async (req, res) => {
  try {
    const dayParam = req.params.day.toUpperCase();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const history = await Workout.find({
      day: dayParam,
      date: { $gte: startOfDay, $lte: endOfDay }
    }).populate('exerciseId');

    res.json(history);
  } catch (err) {
    console.error('Erro ao buscar histórico:', err);
    res.status(500).json({ error: err.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const { exerciseId, day } = req.body;

    const workout = new Workout({
      exerciseId,
      day: day.toUpperCase()
    });

    await workout.save();
    res.status(201).json(workout);
  } catch (err) {
    console.error('Erro ao salvar histórico:', err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
