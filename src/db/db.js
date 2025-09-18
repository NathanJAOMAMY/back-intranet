const mongoose = require('mongoose');
const initDb = require('./initDb.js');

const connectDB = async () => {
  console.log(process.env.MONGO_URI)
  try {
    await mongoose.connect(process.env.MONGO_URI);
    initDb()
    console.log('MongoDB connecté avec succès');
  } catch (err) {
    console.error(' Échec de connexion à MongoDB :', err);
    process.exit(1); // arrête l'app si la connexion échoue
  }
};

module.exports = connectDB;
