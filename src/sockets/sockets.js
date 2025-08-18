module.exports = (io) => {
  io.on("connection", (socket) => {
    // console.log("Socket connectée:", socket.id);

    // Un client s'identifie (rejoindre sa room perso)
    socket.on("userConnected", (userId) => {
      socket.join(`user_${userId}`);
      // console.log(`User ${userId} rejoint sa room user_${userId}`);
    });

    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
      // console.log(`Socket ${socket.id} a rejoint conversation ${conversationId}`);
    });

    socket.on("leaveConversation", (conversationId) => {
      socket.leave(conversationId);
      // console.log(`Socket ${socket.id} a quitté conversation ${conversationId}`);
    });

    socket.on("sendMessage", (message) => {
      const { conversationId, senderId, receiverId } = message;

      // 1. Émettre à tous dans la conversation (pour ceux qui regardent en direct)
      io.to(conversationId).emit("newMessage", message);

      // 2. Émettre aussi directement au destinataire via sa room perso
      if (receiverId) {
        io.to(`user_${receiverId}`).emit("newMessage", message); // ajout ici
        io.to(`user_${receiverId}`).emit("new_message_notification", {
          conversationId,
          message,
          fromUser: senderId,
        });
      }
    });

    socket.on("mark_conversation_read", ({ userId, conversationId }) => {
      // Informer toutes les sessions de ce user que la conversation est lue (multi-onglets)
      io.to(`user_${userId}`).emit("conversation_read", { conversationId });
    });

    socket.on("newConversation", ({ conversation, userIds }) => {
      // Broadcast aux utilisateurs concernés
      userIds.forEach((uid) => {
        io.to(`user_${uid}`).emit("newConversation", conversation);
      });
    });
    socket.on("disconnect", () => {
      // console.log(`Socket déconnectée: ${socket.id}`);
    });
  });
};
