const chatModel = require("../Models/chatModel");
const messageModel = require("../Models/message");

const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;
  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    if (chat) {
      return res.status(200).send(chat);
    }
    const newChat = new chatModel({
      members: [firstId, secondId],
    });
    const response = await newChat.save();
    res.status(200).send(response);
  } catch (err) {
    console.log(err);
    res.satatus(500).send({ message: err });
  }
};

const findUserChats = async (req, res) => {
  const userId = req.params.userId;

  try {
    const chats = await chatModel
      .find({
        members: { $in: [userId] },
      })
      .sort({ lastMessageTime: -1 });
    res.status(200).send(chats);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

const findChat = async (req, res) => {
  const { firstId, secondId } = req.body;

  try {
    const chat = await chatModel.find({
      members: { $all: [firstId, secondId] },
    });
    res.status(200).send(chat);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

const updateIsReadChat = async (req, res) => {
  try {
    const { chatId, isRead, preCount } = req.body;
    const response = await chatModel.findOneAndUpdate({ _id: chatId }, { isRead, unReadMessageCount: preCount++ });
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

const updateConfigUser = async (req, res) => {
  const { userId, chatId, userConfig } = req.body;
  console.log(userId, chatId, userConfig);
  try {
    const chat = await chatModel.find({ _id: chatId });
    // console.log("chat", chat);
    console.log("JSON", chat[0].config);
    const user = chat[0]?.config?.find((userC) => userC.userId === userId);
    console.log("user", user);
    const userNotConfig = chat[0]?.config?.find((userC) => userC.userId !== userId);
    const res = await chatModel.findOneAndUpdate(
      { _id: chatId },
      { config: [userNotConfig, { ...user, ...userConfig }] }
    );
    res.status(200).send(res);
  } catch (err) {
    res.status(500).send(err);
  }
};

const updateChat = async (req, res) => {
  // const res = await messageModel.find({_id})
  try {
    const chats = await chatModel.find();

    chats.map(async (chatRoom) => {
      await chatModel.findOneAndUpdate(
        { _id: chatRoom._id },
        {
          config: [
            { userId: chatRoom.members[0], isRead: true, unReadMessageCount: 0 },
            { userId: chatRoom.members[1], isRead: true, unReadMessageCount: 0 },
          ],
        }
      );
    });
    // const response = await chatModel.updateMany({}, { config: [] });
    // const response = await chatModel.find();
    res.status(200).send(chats);
  } catch (err) {
    res.status(500).send(err);
  }
};
module.exports = { createChat, findUserChats, findChat, updateChat, updateConfigUser };
