const mongoose = require('mongoose');

const conversationUserSchema = new mongoose.Schema({
  idConversation: {
    type: String,
    required: true
  },
  idUser: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true // Ajoute automatiquement createdAt & updatedAt
});

const ConversationUser = mongoose.model('ConversationUser', conversationUserSchema);

module.exports = ConversationUser;