// codeInscriptionController.js
let db;

const init = (database) => {
  db = database;
};

// Créer un code d'inscription
const createCodeInscription = async (req, res) => {
  const { id_code, content_code } = req.body;

  try {
    const result = await db.collection("codeInscriptions").insertOne({
      id_code,
      content_code,
      createdAt: new Date()
    });

    res.status(201).json({
      message: "Code d'inscription créé !",
      data: result.ops[0],
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de la création du code d'inscription" });
  }
};

// Récupérer tous les codes
const getAllCodes = async (req, res) => {
  try {
    const codes = await db.collection("codeInscriptions").find().toArray();

    res.status(200).json({
      message: "Codes récupérés avec succès",
      data: codes,
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des codes" });
  }
};

// Récupérer un seul code par id_code
const getSingleCode = async (req, res) => {
  const { id } = req.params;

  try {
    const code = await db.collection("codeInscriptions").findOne({ id_code: id });

    if (!code) {
      return res.status(404).json({ message: "Code introuvable" });
    }

    res.status(200).json({
      message: "Code récupéré avec succès",
      data: code,
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de la récupération du code" });
  }
};

// Supprimer un code par id_code
const deleteCode = async (req, res) => {
  const { id } = req.query;

  try {
    const code = await db.collection("codeInscriptions").findOne({ id_code: id });

    if (!code) {
      return res.status(404).json({ message: "Code introuvable." });
    }

    await db.collection("codeInscriptions").deleteOne({ id_code: id });

    return res.status(200).json({ message: "Code supprimé avec succès." });
  } catch (error) {
    console.error("Erreur suppression :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  init,
  createCodeInscription,
  getAllCodes,
  getSingleCode,
  deleteCode,
};
