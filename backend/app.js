const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const exerciseRoutes = require('./routes/exerciseRoutes');
const workoutRoutes = require('./routes/workoutRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas conectado'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);

app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});

