// middleware/multerConfig.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Dossier de destination
const uploadFolder = path.join(__dirname, "../uploads/fileChat");

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;
