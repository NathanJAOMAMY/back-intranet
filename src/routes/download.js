/* eslint-disable no-undef */
const express = require('express');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver')
const router = express.Router();
const {getFinalUploadPath} = require('./upload')


 
router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const fileDir = getFinalUploadPath()
  const filePath = path.join( fileDir ,filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Fichier non trouvé.' });
  }

  res.download(filePath, filename); // Force le téléchargement
}); 

// router.get('/download-folder/:folderId', async (req, res) => {
//   try {
//     const fileDir = getFinalUploadPath()
//     const folderId = req.params.folderId;
//     console.log(folderId);
    

//     // 1. Récupérer tous les fichiers liés à ce dossier
//     const files = await Files.findAll({ where: { folder_id: folderId } });

//     if (files.length === 0) {
//       return res.status(404).json({ message: "Aucun fichier trouvé dans ce dossier." });
//     }

//     res.setHeader('Content-Disposition', `attachment; filename=folder_${folderId}.zip`);
//     res.setHeader('Content-Type', 'application/zip'); 

//     const archive = archiver('zip', { zlib: { level: 9 } });
//     archive.pipe(res);

//     // 2. Ajouter chaque fichier au ZIP
//     files.forEach(file => {
//       const filePath = path.join(fileDir, file.libelle_file);
//       console.log(filePath);
      
//       archive.file(filePath, { name: file.libelle_file }); // nom dans le zip
//     });

//     archive.finalize();

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Erreur lors du téléchargement du dossier.' });
//   }
// });

router.get('/download-folder/:folderName', (req, res) => {  const folderName = req.params.folderName;
  const fileDir = getFinalUploadPath()
  const folderPath = path.join( fileDir , folderName);
  

  res.setHeader('Content-Disposition', `attachment; filename=${folderName}.zip`);
  res.setHeader('Content-Type', 'application/zip');

  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.directory(folderPath, false);
  archive.pipe(res); 
 
  archive.finalize();
}); 

module.exports = router;