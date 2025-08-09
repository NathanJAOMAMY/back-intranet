const { request } = require('express');
const fileModel = require('../models/files');
const folderModel = require('../models/folder');

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

// to check
const createMultipleFiles = async (req, res) => {
    const id_folder = req.body.folder_id;
    const folderName = req.body.folder_name;
    const files = req.body.files;
    

    try {
        // Création du dossier
        const folder = await folderModel.create({
            id_folder: id_folder,
            libelle_folder: folderName 
        });

        // Ajout des fichiers
        const filesToCreate = files.map(file => ({
            id_file: file.id_file,
            libelle_file: file.libelle_file,
            size_file: file.size_file,
            type_file: file.type_file,
            url: file.url,
            folder_id: folder.id_folder // MongoDB utilise _id
        }));

        await fileModel.insertMany(filesToCreate);

        res.status(200).send('Fichiers enregistrés avec succès.');
    } catch (error) {
        console.error('Erreur lors de l\'importation :', error);
        res.status(500).send('Erreur serveur.');
    }
}

module.exports = {
    createFile,
    getFiles,
    deleteFile,
    getFileById,
    createMultipleFiles
};