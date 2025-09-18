// folderController.js
let db;

const init = (database) => {
  db = database;
};

// 📁 Créer un dossier
const createFolder = async (req, res) => {
  const { id_folder, libelle_folder } = req.body;

  try {
    const result = await db.collection("folders").insertOne({
      id_folder,
      libelle_folder,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Dossier créé avec succès",
      data: result.ops[0],
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de la création du dossier" });
  }
};

// 📁 Récupérer tous les dossiers
const getFolders = async (req, res) => {
  try {
    const folders = await db.collection("folders").find().toArray();

    if (folders.length === 0) {
      return res.status(404).json({ message: "Aucun dossier trouvé" });
    }

    res.status(200).json({
      message: "Dossiers récupérés avec succès",
      data: folders,
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des dossiers" });
  }
};

// 📁 Récupérer un dossier par ID
const getFolderById = async (req, res) => {
  const { id } = req.params;

  try {
    const folder = await db.collection("folders").findOne({ id_folder: id });

    if (!folder) {
      return res.status(404).json({ message: "Dossier introuvable" });
    }

    res.status(200).json({
      message: "Dossier récupéré avec succès",
      data: folder,
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de la récupération du dossier" });
  }
};

// 📁 Supprimer un dossier
const deleteFolder = async (req, res) => {
  const { id } = req.params;

  try {
    const folder = await db.collection("folders").findOne({ id_folder: id });

    if (!folder) {
      return res.status(404).json({ message: "Dossier introuvable." });
    }

    await db.collection("folders").deleteOne({ id_folder: id });

    res.status(200).json({ message: "Dossier supprimé avec succès" });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de la suppression du dossier" });
  }
};

module.exports = {
  init,
  createFolder,
  getFolders,
  getFolderById,
  deleteFolder,
};
