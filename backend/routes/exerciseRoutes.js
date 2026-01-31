const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');

// Criar novo exercício (aluno ou personal)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      day,
      sets,
      reps,
      mediaUrl,
      description,
      muscleGroup,
      alunoId,
      personalId
    } = req.body;

    if (!name || !day || !muscleGroup || !sets || !reps) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    const exercise = new Exercise({
      name,
      day: day.toUpperCase(),
      sets,
      reps,
      mediaUrl,
      description,
      muscleGroup,
      alunoId: alunoId || null,
      personalId: personalId || null
    });

    await exercise.save();
    res.status(201).json(exercise);
  } catch (err) {
    console.error('Erro ao criar exercício:', err);
    res.status(400).json({ error: err.message });
  }
});

// Buscar exercícios com filtros opcionais
router.get('/', async (req, res) => {
  try {
    const { day, group, alunoId, personalId } = req.query;

    const filter = {};
    if (day) filter.day = day.toUpperCase();
    if (group) filter.muscleGroup = group;
    if (alunoId) filter.alunoId = alunoId;
    if (personalId) filter.personalId = personalId;

    const exercises = await Exercise.find(filter);
    res.json(exercises);
  } catch (err) {
    console.error('Erro ao buscar exercícios:', err);
    res.status(500).json({ error: err.message });
  }
});

// Buscar exercícios por dia e grupo muscular
router.get('/:day/:muscleGroup', async (req, res) => {
  try {
    const dayParam = req.params.day.toUpperCase();
    const groupParam = req.params.muscleGroup;

    const exercises = await Exercise.find({
      day: dayParam,
      muscleGroup: groupParam
    });

    res.json(exercises);
  } catch (err) {
    console.error('Erro ao buscar exercícios:', err);
    res.status(500).json({ error: err.message });
  }
});

// Atualizar exercício
router.put('/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(exercise);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Deletar exercício
router.delete('/:id', async (req, res) => {
  try {
    await Exercise.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exercício deletado com sucesso!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
