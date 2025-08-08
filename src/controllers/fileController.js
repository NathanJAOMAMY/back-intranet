const fileModel = require('../models/files');

const createFile = async (req, res) => {
    const { id_file, libelle_file, size_file, type_file, url } = req.body;

    try {
        const newFile = await fileModel.create({
            id_file,
            libelle_file,
            size_file,
            type_file,
            url,
        });

        res.status(201).json({ message: "Fichier créé avec succès", data: newFile });
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ error: "Erreur lors de la création du fichier" });
    }
}

const  getFiles = async (req, res) => {
    const folderId = req.query.id || null;

    try {
        const files = await fileModel.find({ folder_id: folderId });

        if (files.length === 0) {
            return res.status(404).json({ message: "Aucun fichier trouvé" });
        }

        res.status(200).json({ message: "Fichiers récupérés avec succès", data: files });
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des fichiers" });
    }
}

const getFileById = async (req, res) => {
    const { id } = req.params;
    try {
        const file = await fileModel.findOne({ id_file: id });

        if (!file) {
            return res.status(404).json({ message: "Fichier introuvable" });
        }

        res.status(200).json({ message: "Fichier récupéré avec succès", data: file });
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ error: "Erreur lors de la récupération du fichier" });
    }
}

const deleteFile = async (req, res) => {
    const { id } = req.params;

    try {
        const file = await fileModel.findOne({ id_file: id });

        if (!file) {
            return res.status(404).json({ message: "Fichier introuvable" });
        }

        // Suppression du fichier du disque (logique à implémenter selon votre système de fichiers)
        // await deleteFileFromDisk(file.url);

        await fileModel.deleteOne({ id_file: id });

        res.status(200).json({ message: "Fichier supprimé avec succès" });
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ error: "Erreur lors de la suppression du fichier" });
    }
}

module.exports = {
    createFile,
    getFiles,
    deleteFile,
    getFileById
};