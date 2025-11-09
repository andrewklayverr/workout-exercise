const express = require('express');
const router = express.Router();
const { createExercise, getExercisesByDay } = require('../controllers/exerciseController');

router.post('/exercises', createExercise);
router.get('/exercises/:day', getExercisesByDay);

module.exports = router;
