const express = require("express");
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
  
  server.listen(port, () => {
    console.log(`Serveur is run`);
  });
}

module.exports = startServer;
