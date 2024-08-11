const express = require("express");
const route = express.Router();
const { createMessage, getMessage, getLatestMessage } = require("../Controllers/messageController");

route.post("/create", createMessage);
route.get("/getMessage/:chatId", getMessage);
route.get("/getLatestMessage/:chatId", getLatestMessage);

module.exports = route;
