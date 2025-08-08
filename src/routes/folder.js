/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
// const fs = require('fs')
// const { getFinalUploadPath } = require('./upload')

const path = require('path')

const {createFolder,getFolderById,getFolders,deleteFolder} = require('../controllers/folderController')


router.post('/', createFolder)

router.get('/', getFolders)

router.get('/:id', getFolderById)

router.delete('/:id', deleteFolder)

module.exports = router