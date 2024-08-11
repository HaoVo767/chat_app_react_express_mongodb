const mongoose = require("mongoose");

const messageSchem = new mongoose.Schema(
  {
    chatId: String,
    senderId: String,
    text: String,
  },
  {
    timestamps: true,
  }
);

const messageModel = mongoose.model("Message", messageSchem);

module.exports = messageModel;
