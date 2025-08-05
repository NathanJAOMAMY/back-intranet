// routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerConfig");

router.post("/uploadFileChat/:typefile", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Aucun fichier reçu" });

    // Chemin à retourner (ex: /uploads/1234.png)
    const filePath = `/uploads/fileChat/${req.file.filename}`;
    res.status(200).json({ filePath });
  } catch (error) {
    console.error("Erreur upload:", error);
    res.status(500).json({ message: "Erreur serveur lors de l’upload" });
  }
});

module.exports = router;
