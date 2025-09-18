const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");

const initDb = async (db) => {
  try {
    const usersCollection = db.collection("users");

    // Vérifier si l'utilisateur Admin existe déjà
    const existing = await usersCollection.findOne({ userName: "Admin" });

    if (!existing) {
      const defaultUsers = [
        { userName: "Admin", surname: "Admin", roleUser: "admin", password: "admin" },
        { userName: "Mika", surname: "Mika", roleUser: "user", password: "0000" },
        { userName: "Nathan", surname: "Nathan", roleUser: "user", password: "0000" },
        { userName: "Ibrahim", surname: "Ibrahim", roleUser: "user", password: "0000" }
      ];

      // On hash tous les mots de passe en parallèle
      const usersWithHashedPasswords = await Promise.all(
        defaultUsers.map(async (user) => ({
          idUser: uuid(),
          userName: user.userName,
          surname: user.surname,
          roleUser: user.roleUser,
          password: await bcrypt.hash(user.password, 10)
        }))
      );

      // Insert tous les utilisateurs d’un coup
      await usersCollection.insertMany(usersWithHashedPasswords);

      console.log("✅ Utilisateurs par défaut créés avec succès !");
    } else {
      console.log("ℹ️ Les utilisateurs par défaut existent déjà.");
    }

    console.log("✅ Base de données initialisée !");
  } catch (err) {
    console.error("❌ Erreur lors de l'initialisation de la base :", err);
  }
};

module.exports = initDb;
