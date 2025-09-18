const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let db;

const init = (database) => {
  db = database;
};

// 🔹 Inscription
const inscriptions = async (req, res) => {
  try {
    const { surname, userName, email, roleUser, password } = req.body;

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "L'adresse email que vous essayez d'utiliser existe déjà.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection("users").insertOne({
      surname,
      userName,
      email,
      roleUser,
      password: hashedPassword,
      createdAt: new Date(),
    });

    const userSafe = { ...result.ops[0] };
    delete userSafe.password;

    res.status(200).json({
      message: "Votre compte a été bien enregistré.",
      data: userSafe,
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
};

// 🔹 Récupérer tous les utilisateurs
const allUsers = async (req, res) => {
  try {
    const users = await db.collection("users").find({}, { projection: { password: 0 } }).toArray();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
};

// 🔹 Connexion / login
const log = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await db.collection("users").findOne({ userName });
    if (!user) return res.status(404).json({ message: "Compte non disponible." });

    const correctPass = await bcrypt.compare(password, user.password);
    if (!correctPass) return res.status(400).json({ message: "Mot de passe incorrect." });

    const token = jwt.sign(
      { userId: user._id, userName: user.userName, avatar: user.avatar },
      "MY_PRIVATE_KEY",
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 3600 * 1000,
    });

    const userSafe = { ...user };
    delete userSafe.password;

    res.status(200).json({ user: userSafe, token });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
};

// 🔹 Récupérer un utilisateur par ID
const userByIds = async (req, res) => {
  try {
    const user = await db.collection("users").findOne(
      { _id: require("mongodb").ObjectID(req.params.id) },
      { projection: { password: 0 } }
    );

    if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });
    res.status(200).json({ message: "Utilisateur récupéré", data: user });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
};

// 🔹 Mise à jour utilisateur sans modifier le mot de passe
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { userName, surname, email, roleUser, statusUser, pseudo, avatar, responsibilities } = req.body;

  try {
    const result = await db.collection("users").updateOne(
      { _id: require("mongodb").ObjectID(id) },
      { $set: { userName, surname, email, roleUser, statusUser, pseudo, avatar, responsibilities } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    res.status(200).json({ message: "Utilisateur modifié", data: result });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
};

// 🔹 Mise à jour du mot de passe
const updatePassword = async (req, res) => {
  try {
    const { oldPass, newPass } = req.body;
    const user = await db.collection("users").findOne({ _id: require("mongodb").ObjectID(req.params.id) });

    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const isOk = await bcrypt.compare(oldPass, user.password);
    if (!isOk) return res.status(401).json({ message: "Ancien mot de passe incorrect" });

    const hashNewPass = await bcrypt.hash(newPass, 10);
    await db.collection("users").updateOne(
      { _id: require("mongodb").ObjectID(req.params.id) },
      { $set: { password: hashNewPass } }
    );

    res.status(200).json({ message: "Mot de passe mis à jour" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
};

// 🔹 Suppression d'un utilisateur
const deleteUser = async (req, res) => {
  try {
    const result = await db.collection("users").deleteOne({ _id: require("mongodb").ObjectID(req.params.id) });

    if (result.deletedCount === 0) return res.status(404).json({ message: "Utilisateur introuvable" });

    res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
};

module.exports = {
  init,
  inscriptions,
  allUsers,
  log,
  userByIds,
  updateWithoutPassword: updateUser,
  updateWithPassword: updatePassword,
  deleteUser,
};
