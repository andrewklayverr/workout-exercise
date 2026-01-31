const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env'
});

console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL); 


const exerciseRoutes = require('./routes/exerciseRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const authRoutes = require('./routes/auth.routes');

const app = express();


app.use(cors({
  origin: process.env.FRONTEND_URL || '*', 
  credentials: true
}));

app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas conectado'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));


app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
