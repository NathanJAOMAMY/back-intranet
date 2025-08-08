const codeInscription = require("../models/codeInscriptionModel");

const createCodeInscription = async (req, res) => {
  const { id_code, content_code } = req.body;

  try {
    const newCode = await codeInscription.create({
        id_code,
        content_code,
    });

    res.status(201).json({ message: "Code d'inscription créé !", data: newCode });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de la création du code d'inscription" });
  }
}

const getAllCodes = async (req, res) => {
  try {
    const codes = await codeInscription.find();
    res.status(200).json({ message: "Codes récupérés avec succès", data: codes });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des codes" });
  } 
}

const getSingleCode = async (req, res) => {
    const { id } = req.params;
    
    try {
        const code = await codeInscription.findOne({id_code: id});
        if (!code) {
        return res.status(404).json({ message: "Code introuvable" });
        }
        res.status(200).json({ message: "Code récupéré avec succès", data: code });
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ error: "Erreur lors de la récupération du code" });
    }
    }

const deleteCode = async (req, res) => {
    const { id } = req.query;
    try {
        const code = await codeInscription.findOne({ id_code: id });
        if (!code) {
            return res.status(404).json({ message: "Code introuvable." });
        }

        await codeInscription.deleteOne({ id_code: id });
        return res.status(200).json({ message: "Code supprimé avec succès." });
    } catch (error) {
        console.error("Erreur suppression :", error);
        return res.status(500).json({ message: "Erreur serveur." });
    }
}

module.exports = {
  createCodeInscription,
  getAllCodes,
  getSingleCode,
  deleteCode
}