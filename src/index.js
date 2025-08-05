/* eslint-disable no-undef */
const express = require("express");
const sequelize = require("./db/sequelize");
const { Files } = require("./db/sequelize");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");
const http = require("http");
const socketInit = require("./sockets/sockets");
const socialMediaRoutes = require("./routes/socialMedia");
const uploadRoutes = require("./routes/upload");
const downloadRoutes = require("./routes/download");
const userRouter = require("./routes/userRoute");
const file = require("./routes/file");
const code = require("./routes/codeInscription"); 
const folder = require("./routes/folder");
const chat = require("./routes/chat");
const uploadRoutesChat = require("./routes/uploadRouteChat");
const connectMongo = require("./db/db.js");
const env = require("dotenv");
env.config();

connectMongo();

function startServer(options = {}) {
  const app = express();
  const {
    port = 10000,
    uploadPath = path.join(__dirname),
    allowedOrigin = "http://localhost:5173",
  } = options;

  // pour le socket.io
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  app.use(
    cors({
      origin: allowedOrigin,
      credentials: true,
    })
  );

  socketInit(io);
  sequelize.initDb();
  uploadRoutes.setUploadPath(uploadPath);

  app.use("/images", express.static(path.join(uploadPath, "uploads", "final")));
  app.use(
    "/uploads",
    express.static(path.join(uploadPath, "uploads", "final"))
  );
  app.use(express.json());
  app.use("/api", uploadRoutes);
  app.use("/api", downloadRoutes);
  app.use("/auth", userRouter);
  app.use("/folder", folder);
  app.use("/file", file);
  app.use("/code", code);
  app.use("/chat", chat);
  app.use("/uploads/fileChat", express.static(path.join(__dirname, "uploads/fileChat")));
  app.use("/api", uploadRoutesChat);
  app.use("/social", socialMediaRoutes);
  app.use("/social", express.static(path.join(__dirname, "uploads", "social")));

  // Code à étudier
  // const upload = multer({
  //   storage: multer.diskStorage({
  //     destination: (req, file, cb) => {
  //       const uploadPath = path.join(__dirname, "uploads/final", path.dirname(file.originalname));
  //       fs.mkdirSync(uploadPath, { recursive: true }); // crée les sous-dossiers
  //       cb(null, uploadPath);
  //     },
  //     filename: (req, file, cb) => {
  //       cb(null, path.basename(file.originalname));
  //     },
  //   }),
  // });

  // app.post("/upload-folder", upload.array("files"), async  (req, res) => {
  //    try {
  //     const fichiers = req.files;

  //     // Enregistrer chaque fichier dans la BDD
  //     for (const file of fichiers) {
  //           const nomFichier = file.originalname;
  //           const size = file.size;
  //           const type = path.extname(nomFichier).substring(1);

  //       await Files.create({
  //         libelle_file: nomFichier,
  //         size_file: size,
  //         type_file: type,
  //       });
  //     }

  //     res.status(200).send("Dossier reçu et fichiers enregistrés.");
  //   } catch (error) {
  //     console.error("Erreur lors de l'importation :", error);
  //     res.status(500).send("Erreur serveur lors de l'importation.");
  //   }
  // });

  server.listen(port, () => {
    console.log(`✅ Serveur lancé sur http://localhost:${port}`);
  });
}

module.exports = startServer;
