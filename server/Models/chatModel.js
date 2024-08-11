const mongoose = require("mongoose");

const chatSchem = new mongoose.Schema(
  {
    members: Array,
    lastMessage: String,
    lastMessageTime: Date,
    config: Array,
    // isRead: Boolean,
    // unReadMessageCount: Number,
  },
  {
    timestamps: true,
  }
);

const chatModel = mongoose.model("Chat", chatSchem);

module.exports = chatModel;
