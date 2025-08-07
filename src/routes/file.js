/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express')
const mime = require('mime')
const router = express.Router()
const fs = require('fs')
const {getFinalUploadPath} = require('./upload')

const {Files, sequelize} = require('../db/sequelize')
const path = require('path')

router.get('/', (req,res)=>{
    const params = req.query.id ? req.query.id : null;
    
    Files.findAll({
        where : { 
            folder_id : params
        }
    })
    .then(files=>{
        const message = 'Fichier recupérée avec success';
        res.status(200).json({message, data : files})
    })
})

router.get('/:id', (req,res)=>{
    Files.findByPk(req.params.id)
    .then(files=>{
        const message = 'Fichier recupérée avec success';
        res.status(200).json({message, data : files})
    })
})

router.delete('/', async (req,res)=>{
    const {id} = req.query
    console.log(getFinalUploadPath());
    try {
        // Verifier si le fichier existe dans la base de donnée
        const file = await Files.findByPk(id)

        if(!file){
            return res.status(404).json({ message: 'Fichier introuvable.' });
        }
        const finalPath = getFinalUploadPath();
        const filePath = path.join(finalPath, file.libelle_file);

        // Suppression du fichiers
        // sur le disk

        fs.unlink(filePath, async (err)=>{
            if(err && err.code!=="ENOENT"){
                console.error('Erreur lors de la suppression du fichier :', err);
                return res.status(500).json({ message: 'Erreur lors de la suppression du fichier.' });
            }

            // Supprimer dans la base
            await Files.destroy({ where: { id_file: id } });

            return res.status(200).json({ message: 'Fichier supprimé avec succès.' });
        })

    } catch (error) {
        console.error('Erreur suppression :', error);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
    
}) 

router.get('/read/:foldername/:filename', (req, res) => {
  const { filename, foldername } = req.params;
  let filePath; 
 filePath = path.join(getFinalUploadPath() ,filename);
  
  if (foldername !== 'null') {
      filePath = path.join(getFinalUploadPath(),foldername ,filename);
    }
    
  if (fs.existsSync(filePath)) { 
    const mimeType = mime.getType(filePath);
    res.setHeader('Content-Type', mimeType); 
    res.setHeader('Content-Disposition', 'inline');
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).send('Fichier non trouvé.');
  }
});

module.exports = router