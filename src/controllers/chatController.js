let db; // sera injecté depuis connectDB.js

const init = (database) => {
  db = database;
};

//  Envoyer un message
const sendMessage = async (req, res) => {
  const { conversationId, content, senderId, id, file } = req.body;

  try {
    const result = await db.collection("chatMessages").insertOne({
      id,
      content,
      conversationId,
      senderId,
      file: file || null,
      createdAt: new Date()
    });

    res.status(201).json({ message: "Message envoyé !", data: result.ops[0] });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de l'envoi du message" });
  }
};

//  Récupérer les messages
const getMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await db
      .collection("chatMessages")
      .find({ conversationId })
      .sort({ createdAt: 1 })
      .toArray();

    res.json(messages);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des messages" });
  }
};

// Récupérer les conversations d'un utilisateur
const getChatConversation = async (req, res) => {
  const { idUser } = req.params;
  try {
    const chatConversation = await db
      .collection("chatConversations")
      .find({ userIdConversations: idUser })
      .sort({ updatedAt: -1 })
      .toArray();

    res.json(chatConversation);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des conversations" });
  }
};

// Créer une conversation
const setChatConversation = async (req, res) => {
  const { id, name, isRead, userIdConversations } = req.body;
  try {
    const result = await db.collection("chatConversations").insertOne({
      id,
      name,
      isRead,
      userIdConversations,
      updatedAt: new Date()
    });

    res.status(201).json({ message: "Conversation créée !", data: result.ops[0] });
  } catch (error) {
    console.log("Erreur : ", error);
    res.status(500).json({ error: "Erreur lors de la création de la conversation" });
  }
};

// Ajouter un utilisateur à une conversation
const setConversationUser = async (req, res) => {
  const { idConversation, idUser, isRead } = req.body;

  try {
    const result = await db.collection("conversationUsers").insertOne({
      idConversation,
      idUser,
      isRead
    });

    res.status(201).json({
      message: "Utilisateur ajouté à la conversation",
      data: result.ops[0],
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout de l'utilisateur" });
  }
};

// Récupérer les utilisateurs d'une conversation
const getConversationUsers = async (req, res) => {
  const { idUser } = req.params;

  try {
    const conversationUsers = await db
      .collection("conversationUsers")
      .find({ idUser })
      .toArray();

    res.status(200).json(conversationUsers);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
  }
};

// Trouver un utilisateur dans une conversation
const findConversationUser = async (req, res) => {
  const { idConversation, idUser } = req.params;

  try {
    const conversationUser = await db.collection("conversationUsers").findOne({
      idConversation,
      idUser
    });

    res.status(200).json(conversationUser);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de la récupération de l'utilisateur" });
  }
};

// Mettre à jour le statut de lecture
const updateConversationUser = async (req, res) => {
  const { idConversation, idUser, isRead } = req.body;

  try {
    const result = await db.collection("conversationUsers").updateOne(
      { idConversation, idUser },
      { $set: { isRead } }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Statut de lecture mis à jour" });
    } else {
      res.status(404).json({ message: "Conversation ou utilisateur non trouvé" });
    }
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
};

// Mise à jour d'une conversation
const updatedConversation = async (req, res) => {
  const { conversationId, userIds, conversation } = req.body;

  if (!conversationId) {
    return res.status(400).json({ message: "conversationId est requis." });
  }

  try {
    let updateQuery = {};

    if (Array.isArray(userIds) && userIds.length > 0) {
      updateQuery.$addToSet = { userIdConversations: { $each: userIds } };
    }

    if (conversation && typeof conversation === "object") {
      updateQuery.$set = conversation;
    }

    if (Object.keys(updateQuery).length === 0) {
      return res.status(400).json({ message: "Aucune donnée à mettre à jour." });
    }

    const updated = await db.collection("chatConversations").findOneAndUpdate(
      { id: conversationId },
      updateQuery,
      { returnOriginal: false }
    );

    if (!updated.value) {
      return res.status(404).json({ message: "Conversation introuvable." });
    }

    return res.status(200).json(updated.value);
  } catch (err) {
    console.error("Erreur mise à jour conversation:", err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  init,
  sendMessage,
  getMessages,
  setConversationUser,
  updateConversationUser,
  getConversationUsers,
  setChatConversation,
  getChatConversation,
  updatedConversation,
  findConversationUser,
};
