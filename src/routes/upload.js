/* eslint-disable no-undef */
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
// eslint-disable-next-line no-unused-vars
const { Files, Folder, sequelize } = require('../db/sequelize');

let finalUploadDir = 'uploads/final';
let tmpUploadDir = 'uploads/tmp';
let upload; // 
// let uploadMulti;

// Générer les dossiers d'uploads
function setUploadPath(baseDir) {
  finalUploadDir = path.join(baseDir, 'uploads', 'final');
  tmpUploadDir = path.join(baseDir, 'uploads', 'tmp');

  // Crée les dossiers s'ils n'existent pas
  if (!fs.existsSync(finalUploadDir)) fs.mkdirSync(finalUploadDir, { recursive: true });
  if (!fs.existsSync(tmpUploadDir)) fs.mkdirSync(tmpUploadDir, { recursive: true });

  // Configuration unique de multer (fichiers dans tmp, puis déplacés)
  upload = multer({ dest: tmpUploadDir });

// uploadMulti = upload.fields([{ name: 'files' }, { name: 'foldername' }])

}

// Récupérer le dossier d'upload
function getFinalUploadPath() {
  return finalUploadDir;
}

// Upload simple (un seul fichier)
router.post('/upload', async (req, res) => {
    
    // const destinationFinale = path.join(finalUploadDir, nomFichier);
    const { libelle_file, size_file, url } = req.body;
    const type_file = path.extname(libelle_file).substring(1);

      try {
        await Files.create({
          libelle_file: libelle_file,
          size_file: size_file,
          type_file: type_file,
          url: url,
        });
        res.json({ message: 'Fichier déplacé avec succès.' });
      } catch (dbErr) {
        console.error('Erreur DB :', dbErr);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement.' });
      }
});

// Upload multiple fichiers (ex: dossier)
router.post('/upload-folder', (req, res) => {


  upload.fields([{ name: 'files' }, { name: 'foldername' }])(req, res, async (err) => {
    if (err) {
      console.error('Erreur multer :', err);
      return res.status(500).send('Erreur serveur.');
    }
    const folderName = req.body.foldername;


    const transaction = await sequelize.transaction();

    try {
      const folder = await Folder.create({
        libelle_folder: folderName
      }, { transaction })

      const newFolder = path.join(finalUploadDir,folderName)

      fs.mkdirSync(newFolder, { recursive: true })

      try {
        for (const file of req.files.files) {
          const nomFichier = file.originalname; 
          const size = file.size;
          const type = path.extname(nomFichier).substring(1);
          const destinationFinale = path.join(newFolder, nomFichier);

          fs.renameSync(file.path, destinationFinale); 
 

          await Files.create({
            libelle_file: nomFichier,
            size_file: size,
            type_file: type,
            folder_id: folder.id_folder
          }, { transaction });
        }

        // Commit the transaction
        await transaction.commit();

        res.status(200).send('Fichiers enregistrés avec succès.');
      } catch (error) {
        await transaction.rollback(); // Ajoute ça ici
        console.error('Erreur lors de l\'importation :', error);
        res.status(500).send('Erreur serveur.');
      }
    } catch (error) {
      console.error('Erreur lors de la création du dossier', error);
      res.status(500).send('Erreur serveur.');
    }
 

  });
});

// router.post('/upload-folder',uploadMulti, async (req, res) => {

//     if (err) {
//       console.error('Erreur multer :', err);
//       return res.status(500).send('Erreur serveur.');
//     }
//     const folderName = req.body.foldername;


//     const transaction = await sequelize.transaction();

//     try {
//       const folder = await Folder.create({
//         libelle_folder: folderName
//       }, { transaction })

//       const newFolder = path.join(finalUploadDir,folderName)

//       fs.promises.mkdir(newFolder, { recursive: true })

//       try {
//         for (const file of req.files.files) {
//           const nomFichier = file.originalname; 
//           const size = file.size;
//           const type = path.extname(nomFichier).substring(1);
//           const destinationFinale = path.join(newFolder, nomFichier);

//           fs.promises.rename(file.path, destinationFinale); 
 

//           await Files.create({
//             libelle_file: nomFichier,
//             size_file: size,
//             type_file: type,
//             folder_id: folder.id_folder
//           }, { transaction });
//         }

//         // Commit the transaction
//         await transaction.commit();

//         res.status(200).send('Fichiers enregistrés avec succès.');
//       } catch (error) {
//         await transaction.rollback(); 
//         console.error('Erreur lors de l\'importation :', error);
//         res.status(500).send('Erreur serveur.');
//       }
//     } catch (error) {
//       console.error('Erreur lors de la création du dossier', error);
//       res.status(500).send('Erreur serveur.');
//     }
 
// });

module.exports = router;
module.exports.setUploadPath = setUploadPath;
module.exports.getFinalUploadPath = getFinalUploadPath;
