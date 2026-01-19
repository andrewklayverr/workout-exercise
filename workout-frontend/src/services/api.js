import axios from 'axios';

const api = axios.create({
  baseURL: 'https://workout-exercise.onrender.com/api'
});

export default api;