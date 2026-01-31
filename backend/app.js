const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Carrega variáveis de ambiente
dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env'
});

console.log('MONGO_URI:', process.env.MONGO_URI);

// Importa rotas
const exerciseRoutes = require('./routes/exerciseRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const authRoutes = require('./routes/auth.routes'); // ✅ NOVO

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas conectado'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas públicas
app.use('/api/auth', authRoutes); 

// Rotas protegidas (exercícios e treinos)
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
