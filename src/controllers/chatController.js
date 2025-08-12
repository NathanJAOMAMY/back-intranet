const Chat = require("../models/chatMessage");
const ConversationUsers = require("../models/conversationUser");
const ChatConversation = require("../models/chatConversation");
//  Envoyer un message
const sendMessage = async (req, res) => {
  const { conversationId, content, senderId, id, file } = req.body;

  try {
    const message = await Chat.create({
      id: id, // UUID fourni par le front-end
      content: content,
      conversationId: conversationId,
      senderId: senderId,
      file: file || null,
    });

    res.status(201).json({ message: "Message envoyé !", data: message });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de l'envoi du message" });
  }
};

//  Récupérer les messages
const getMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Chat.find({ conversationId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({
      error: "Erreur lors de la récupération des messages",
    });
  }
};
// Recupere les conversation de l'utilisateur
const getChatConvesation = async (req, res) => {
  const { idUser } = req.params;
  try {
    const chatConversation = await ChatConversation.find({
      userIdConversations: idUser,
    }).sort({ updatedAt: -1 });
    res.json(chatConversation);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({
      error: "Erreur lors de la récupération des messages",
    });
  }
};
// Creation d'une conversation
const setChatConvesation = async (req, res) => {
  const { id, name, isRead, userIdConversations } = req.body;
  try {
    const chatConversation = await ChatConversation.create({
      id: id,
      name: name,
      isRead: isRead,
      userIdConversations: userIdConversations,
    });
    res
      .status(201)
      .json({ message: "conversation creer !", date: chatConversation });
  } catch (error) {
    console.log("erreur : ", error);
    res.status(500).json({ error: "Erreur lors du creation du conversation" });
  }
};
//  Ajouter un utilisateur à une conversation
const setConversationUser = async (req, res) => {
  const { idConversation, idUser, isRead } = req.body;

  try {
    const conversationUser = await ConversationUsers.create({
      idConversation: idConversation,
      idUser: idUser,
      isRead: isRead,
    });

    res.status(201).json({
      message: "Utilisateur ajouté à la conversation",
      data: conversationUser,
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({
      error: "Erreur lors de l'ajout de l'utilisateur à la conversation",
    });
  }
};

//  Récupérer les utilisateurs d'une conversation
const getConversationUsers = async (req, res) => {
  const { idUser } = req.params;

  try {
    const conversationUsers = await ConversationUsers.find({
      idUser: idUser,
    });
    res.status(201).json(conversationUsers);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({
      error:
        "Erreur lors de la récupération des utilisateurs de la conversation",
    });
  }
};

//  Mettre à jour le statut de lecture
const updateConversationUser = async (req, res) => {
  const { idConversation, idUser, isRead } = req.body;

  try {
    const updated = await ConversationUsers.updateOne(
      { idConversation: idConversation, idUser: idUser },
      { $set: { isRead: isRead } }
    );

    if (updated.modifiedCount > 0) {
      res.status(200).json({ message: "Statut de lecture mis à jour" });
    } else {
      res
        .status(404)
        .json({ message: "Conversation ou utilisateur non trouvé" });
    }
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({
      error: "Erreur lors de la mise à jour du statut de lecture",
    });
  }
};

const updatedConversation = async (req, res) => {
  const { conversationId, userIds } = req.body;
  if (!conversationId || !Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ message: "conversationId et userIds sont requis." });
  }

  try {
    // Mise à jour sans duplication
    const updatedConversation = await ChatConversation.findOneAndUpdate(
      { id: conversationId },
      { $addToSet: { userIdConversations: { $each: userIds } } },
      { new: true }
    );

    if (!updatedConversation) {
      return res.status(404).json({ message: "Conversation introuvable." });
    }

    // Réponse OK avec la conversation mise à jour
    return res.status(200).json(updatedConversation);

  } catch (err) {
    console.error("Erreur mise à jour conversation:", err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  setConversationUser,
  updateConversationUser,
  getConversationUsers,
  setChatConvesation,
  getChatConvesation,
  updatedConversation
};
