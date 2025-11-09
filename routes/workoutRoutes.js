const express = require('express');
const router = express.Router();
const { saveWorkout, getWorkoutHistory } = require('../controllers/workoutController');

router.post('/workouts', saveWorkout);
router.get('/workouts', getWorkoutHistory);

module.exports = router;
