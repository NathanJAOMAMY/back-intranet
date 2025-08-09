/* eslint-disable no-undef */
const express = require("express");
const sequelize = require("./db/sequelize.js");
const { Files } = require("./db/sequelize.js");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");
const http = require("http");
const socketInit = require("./sockets/sockets.js");
const socialMediaRoutes = require("./routes/socialMedia.js");
const uploadRoutes = require("./routes/upload.js");
const downloadRoutes = require("./routes/download.js");
const userRouter = require("./routes/userRoute.js");
const file = require("./routes/file.js");
const code = require("./routes/codeInscription.js"); 
const folder = require("./routes/folder.js");
const chat = require("./routes/chat.js");
const uploadRoutesChat = require("./routes/uploadRouteChat.js");
const connectMongo = require("./db/db.js");
const env = require("dotenv");
env.config();
 
connectMongo();

function startServer(options = {}) {
  const app = express();
  const {
    port = 3001,
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
  // sequelize.initDb();
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
  app.use("/users", userRouter);
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
