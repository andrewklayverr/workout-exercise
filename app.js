const express = require('express');
const cors = require('cors');
const exerciseRoutes = require('./routes/exerciseRoutes');
const workoutRoutes = require('./routes/workoutRoutes');

const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
connectDB();    

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', exerciseRoutes);
app.use('/api', workoutRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));



