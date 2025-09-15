const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const socketInit = require("./sockets/sockets.js");
const socialMediaRoutes = require("./routes/socialMedia.js");
const userRouter = require("./routes/userRoute.js");
const file = require("./routes/file.js");
const code = require("./routes/codeInscription.js");
const folder = require("./routes/folder.js");
const chat = require("./routes/chat.js");
const connectMongo = require("./db/db.js");
const env = require("dotenv");
env.config();

connectMongo();
const port = process.env.PORT || 3001
// pour le socket.io
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// le cors
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
socketInit(io);

app.use(express.json());
app.use("/auth", userRouter);
app.use("/users", userRouter);
app.use("/folder", folder);
app.use("/file", file);
app.use("/code", code);
app.use("/chat", chat);
app.use("/social", socialMediaRoutes);

server.listen(port, () => {
  console.log(`Serveur lancer`);
});
