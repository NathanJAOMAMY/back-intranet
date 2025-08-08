/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express')
const mime = require('mime')
const router = express.Router()
const fs = require('fs')
const {getFinalUploadPath} = require('./upload')

const {getFiles, createFile, deleteFile, getFileById} = require('../controllers/fileController')
const path = require('path')

router.post('/', createFile)

router.get('/', getFiles)

// router.get('/:id', (req,res)=>{
//     Files.findByPk(req.params.id)
//     .then(files=>{
//         const message = 'Fichier recupérée avec success';
//         res.status(200).json({message, data : files})
//     })
// })
router.get('/:id', getFileById) 

router.delete('/:id', deleteFile) 

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