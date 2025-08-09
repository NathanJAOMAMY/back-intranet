const mongoose = require('mongoose');
const initDb = require('./initDb.js');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    initDb()
    console.log('MongoDB connecté avec succès');
  } catch (err) {
    console.error(' Échec de connexion à MongoDB :', err);
    process.exit(1); // arrête l'app si la connexion échoue
  }
};

module.exports = connectDB;
