// fileController.js
let db;

const init = (database) => {
  db = database;
};

// 📂 Créer un fichier
const createFile = async (req, res) => {
  const { id_file, libelle_file, size_file, type_file, url } = req.body;

  try {
    const result = await db.collection("files").insertOne({
      id_file,
      libelle_file,
      size_file,
      type_file,
      url,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Fichier créé avec succès",
      data: result.ops[0],
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de la création du fichier" });
  }
};

// 📂 Récupérer des fichiers par dossier
const getFiles = async (req, res) => {
  const folderId = req.query.id || null;

  try {
    const files = await db.collection("files").find({ folder_id: folderId }).toArray();

    if (files.length === 0) {
      return res.status(404).json({ message: "Aucun fichier trouvé" });
    }

    res.status(200).json({
      message: "Fichiers récupérés avec succès",
      data: files,
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des fichiers" });
  }
};

// 📂 Récupérer un fichier par ID
const getFileById = async (req, res) => {
  const { id } = req.params;

  try {
    const file = await db.collection("files").findOne({ id_file: id });

    if (!file) {
      return res.status(404).json({ message: "Fichier introuvable" });
    }

    res.status(200).json({
      message: "Fichier récupéré avec succès",
      data: file,
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de la récupération du fichier" });
  }
};

// 📂 Supprimer un fichier
const deleteFile = async (req, res) => {
  const { id } = req.params;

  try {
    const file = await db.collection("files").findOne({ id_file: id });

    if (!file) {
      return res.status(404).json({ message: "Fichier introuvable" });
    }

    // ⚠️ Ici tu peux ajouter ta logique pour supprimer le fichier du disque
    await db.collection("files").deleteOne({ id_file: id });

    res.status(200).json({ message: "Fichier supprimé avec succès" });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de la suppression du fichier" });
  }
};

// 📂 Créer un dossier + plusieurs fichiers d’un coup
const createMultipleFiles = async (req, res) => {
  const { folder_id, folder_name, files } = req.body;

  try {
    // Création du dossier
    const folder = await db.collection("folders").insertOne({
      id_folder: folder_id,
      libelle_folder: folder_name,
      createdAt: new Date(),
    });

    // Ajout des fichiers dans ce dossier
    const filesToCreate = files.map((file) => ({
      id_file: file.id_file,
      libelle_file: file.libelle_file,
      size_file: file.size_file,
      type_file: file.type_file,
      url: file.url,
      folder_id: folder_id, // référence au dossier
      createdAt: new Date(),
    }));

    await db.collection("files").insertMany(filesToCreate);

    res.status(200).send("Fichiers enregistrés avec succès.");
  } catch (error) {
    console.error("Erreur lors de l'importation :", error);
    res.status(500).send("Erreur serveur.");
  }
};

module.exports = {
  init,
  createFile,
  getFiles,
  deleteFile,
  getFileById,
  createMultipleFiles,
};
