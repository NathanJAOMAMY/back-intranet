const mongoose = require("mongoose");

const chatConversationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      // required: true,
    },
    isRead: {
      type: Boolean,
      required: true,
    },
    userIdConversations: {
      type: [String],
      required: true,
    },
    icon : {
      type : String,
      default : ''
    }
  },
  {
    timestamps: true, // ajoute createdAt et updatedAt
  }
);

const ChatConversation = mongoose.model(
  "ChatConversation",
  chatConversationSchema
);
module.exports = ChatConversation;
