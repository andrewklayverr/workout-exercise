const mongoose = require('mongoose');
const Exercise = require('../models/Exercise'); // ajuste o caminho se necessário

async function migrateMuscleGroups() {
  await mongoose.connect('mongodb://localhost:27017/workout', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Exemplo de migração
  await Exercise.updateMany(
    { muscleGroup: 'Ombro' },
    { $set: { muscleGroup: 'Ombro (deltoide anterior)' } }
  );

  await Exercise.updateMany(
    { muscleGroup: 'Quadril' },
    { $set: { muscleGroup: 'Glúteos' } }
  );

  await Exercise.updateMany(
    { muscleGroup: 'Pernas' },
    { $set: { muscleGroup: 'Quadríceps' } }
  );

  console.log('Migração concluída!');
  mongoose.disconnect();
}

migrateMuscleGroups();
