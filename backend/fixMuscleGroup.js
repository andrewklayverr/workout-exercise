require("dotenv").config();
const mongoose = require("mongoose");
const Exercise = require("./models/Exercise");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function listarGrupos() {
  try {
    const grupos = await Exercise.distinct("muscleGroup");
    console.log("Grupos musculares encontrados no banco:");
    console.log(grupos);
  } catch (err) {
    console.error("Erro ao listar grupos:", err);
  } finally {
    mongoose.disconnect();
  }
}

listarGrupos();
