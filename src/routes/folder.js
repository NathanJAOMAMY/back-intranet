const express = require('express');
const router = express.Router();

const { createFolder, getFolderById, getFolders, deleteFolder, 
    shareFolder, getSharedFolders, getFoldersSharedWithMe,
    updateFolder,
    downloadFolder, getFolderTree,
    shareFolderWithDepartement
} = require('../controllers/folderController');

router.post('/', createFolder);
router.post('/share/:id', shareFolder);
router.post('/share-departement/:id', shareFolderWithDepartement);
router.get('/', getFolders);
router.get('/tree/:id', getFolderTree);
router.get('/shared', getSharedFolders);
router.get('/shared-with-me', getFoldersSharedWithMe);
router.get('/:id', getFolderById);
router.delete('/:id', deleteFolder);

router.put("/update", updateFolder);
router.get("/download-folder/:folderId", downloadFolder);
module.exports = router;