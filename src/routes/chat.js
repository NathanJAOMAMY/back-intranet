const express = require("express");
const {
  sendMessage,
  getMessages,
  setConversationUser,
  updateConversationUser,
  getConversationUsers,
  updatedConversation,
  findConversationUser,
  setChatConversation,
  getChatConversation,
} = require("../controllers/chatController.js");
const Router = express.Router();
Router.post("/send", sendMessage); // Envoyer un message
Router.get("/get/:conversationId", getMessages); // Récupérer les messages
Router.post("/setConversationUser", setConversationUser); // Ajouter un utilisateur à une conversation
Router.put("/updateConversationUser", updateConversationUser); // Met
Router.post("/setChatConversation", setChatConversation);
Router.get("/getChatConvesation/:idUser", getChatConversation);
Router.get("/getConversationUsers/:idUser", getConversationUsers); // Récupérer
Router.put("/updatedConversation", updatedConversation);
Router.get(
  "/findConversationUser/:idConversation/:idUser",
  findConversationUser
); // Récupérer les utilisateurs d'une conversation

module.exports = Router;
