const express = require("express");
const { sendMessage, getMessages, setConversationUser, updateConversationUser, setChatConvesation, getChatConvesation, getConversationUsers, updatedConversation,} = require("../controllers/chatController.js");
const upload = require("../middlewares/multerConfig.js");
const Router = express.Router();
Router.post("/send", sendMessage); // Envoyer un message
Router.get("/get/:conversationId", getMessages); // Récupérer les messages
Router.post("/setConversationUser", setConversationUser); // Ajouter un utilisateur à une conversation
Router.put("/updateConversationUser", updateConversationUser); // Met
Router.post("/setChatConversation", setChatConvesation);
Router.get("/getChatConvesation/:idUser", getChatConvesation);
Router.get("/getConversationUsers/:idUser", getConversationUsers); // Récupérer
Router.put("/updatedConversation",updatedConversation)

Router.post("/uploadFile", upload.single("file"), (req, res) => {
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

module.exports = Router;
