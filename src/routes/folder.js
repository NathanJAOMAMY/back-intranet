/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const fs = require('fs')
const { getFinalUploadPath } = require('./upload')

const { Folder } = require('../db/sequelize')
const path = require('path')


router.post('/', (req, res) => {
    const folder = req.body
    const fileDir = getFinalUploadPath()
    const libelleDir = folder.libelle_folder

    const newFolder = path.join(fileDir, libelleDir)


    Folder.create({
        libelle_folder: libelleDir,
    })
        .then(folder => {
            fs.mkdirSync(newFolder, { recursive: true })  
            const message = 'Votre compte a été bien enregistré.'
            res.status(200).json({ message, data: folder })
        })
        .catch(err => { 
            res.status(500).json({ err })
        })

})

router.get('/', (req, res) => {
    Folder.findAll()
        .then(folder => {
            const message = 'Fichier recupérée avec success';
            res.status(200).json({ message, data: folder })
        })
})

router.get('/:id', (req, res) => {
    Folder.findByPk(req.params.id)
        .then(folder => {
            const message = 'Fichier recupérée avec success';
            res.status(200).json({ message, data: folder })
        })
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params 
    
    try {
        // Verifier si le fichier existe dans la base de donnée
        const folder = await Folder.findByPk(id)

        if (!folder) {
            return res.status(404).json({ message: 'Fichier introuvable.' });
        }
        const finaDir = path.join(getFinalUploadPath(), folder.libelle_folder) ;
        fs.rm(finaDir, { 
            recursive: true,
        }, async (error) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Recursive: Directories Deleted!");

                // Get the current filenames
                // in the directory to verify
            await Folder.destroy({ where: { id_folder: id } });
        return res.status(200).json({ message: 'Fichier supprimé avec succès.' });

                
            }
        }); 

        // Supprimer dans la base


    } catch (error) {
        console.error('Erreur suppression :', error);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }

})

module.exports = router