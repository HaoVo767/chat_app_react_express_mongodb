const express = require("express");
const route = express.Router();
const { createChat, findUserChats, findChat, updateChat, updateConfigUser } = require("../Controllers/chatController");

route.post("/createChat", createChat);
route.get("/findChat/:firstId/:secondId", findChat);
route.get("/updateChat", updateChat);
route.post("/updateConfigUser", updateConfigUser);
route.get("/:userId", findUserChats);

module.exports = route;
