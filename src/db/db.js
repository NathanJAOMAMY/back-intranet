// connectDB.js
const { MongoClient } = require("mongodb");
const initDb = require("./initDb.js");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI; 
  console.log("Tentative de connexion à MongoDB avec URI :", mongoUri);

  const client = new MongoClient(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: false // ⚠️ passe à true si TLS est activé côté serveur
  });

  try {
    await client.connect();
    console.log("✅ MongoDB connecté avec succès !");

    const db = client.db("intranet"); // nom de ta base
    await initDb(db); // on initialise la base

    // On garde le client pour le reste de l'application
    return { client, db };
  } catch (err) {
    console.error("❌ Échec de connexion à MongoDB :", err);
    process.exit(1);
  }
};

module.exports = connectDB;
