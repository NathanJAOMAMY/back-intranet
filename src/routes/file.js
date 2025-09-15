const express = require("express");
const mime = require("mime");
const router = express.Router();
const fs = require("fs");

const {
  getFiles,
  createFile,
  deleteFile,
  getFileById,
  createMultipleFiles,
} = require("../controllers/fileController");

router.post("/", createFile);
router.post("/many", createMultipleFiles);

router.get("/", getFiles);
router.get("/:id", getFileById);
router.delete("/:id", deleteFile);
router.get("/read/:foldername/:filename", (req, res) => {

  if (fs.existsSync(filePath)) {
    const mimeType = mime.getType(filePath);
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", "inline");
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).send("Fichier non trouvé.");
  }
});

module.exports = router;
