const folderModel = require('../models/folder');

const createFolder = async (req, res) => {
    const { id_folder, libelle_folder } = req.body;

    try {
        const newFolder = await folderModel.create({
            id_folder,
            libelle_folder,
        });

        res.status(201).json({ message: "Dossier créé avec succès", data: newFolder });
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ error: "Erreur lors de la création du dossier" });
    }
}

const getFolders = async (req, res) => {
    try {
        const folders = await folderModel.find();

        if (folders.length === 0) {
            return res.status(404).json({ message: "Aucun dossier trouvé" });
        }

        res.status(200).json({ message: "Dossiers récupérés avec succès", data: folders });
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des dossiers" });
    }
}
const getFolderById = async (req, res) => {
    const { id } = req.params;
    try {
        const folder = await folderModel.findOne({ id_folder: id });

        if (!folder) {
            return res.status(404).json({ message: "Dossier introuvable" });
        }

        res.status(200).json({ message: "Dossier récupéré avec succès", data: folder });
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ error: "Erreur lors de la récupération du dossier" });
    }
}

const deleteFolder = async (req, res) => {
    const { id } = req.params;

    try {
        const folder = await folderModel.findOne({ id_folder: id });

        if (!folder) {
            return res.status(404).json({ message: `folder : ${folder}` });
        }

        await folderModel.deleteOne({ id_folder: id });

        res.status(200).json({ message: "Dossier supprimé avec succès" });
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ error: "Erreur lors de la suppression du dossier" });
    }
}

module.exports = {
    createFolder,
    getFolders,
    getFolderById,
    deleteFolder
};