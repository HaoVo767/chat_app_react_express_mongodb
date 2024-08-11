const messageModel = require("../Models/message");
const chatModel = require("../Models/chatModel");

const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  try {
    const message = new messageModel({
      chatId,
      senderId,
      text,
    });
    const response = await message.save();
    await chatModel.findOneAndUpdate(
      { _id: chatId },
      { lastMessage: message.text, lastMessageTime: response.createdAt }
    );
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

const getMessage = async (req, res) => {
  const { chatId } = req.params;

  try {
    const response = await messageModel.find({ chatId }).sort({ createdAt: -1 }).limit(30);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

const getLatestMessage = async (req, res) => {
  const { chatId } = req.params;
  try {
    const response = await messageModel.find({ chatId }).sort({ createdAt: -1 }).limit(1);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

module.exports = { createMessage, getMessage, getLatestMessage };
