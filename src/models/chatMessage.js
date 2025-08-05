const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    id: {
      type: String, 
      required: true, 
      unique: true, 
    },
    conversationId: {
      type: String,
      default: null,
    },
    content: {
      type: String,
      default: "",
    },
    senderId: {
      type: String,
      required: true,
    },
    file:
    {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
