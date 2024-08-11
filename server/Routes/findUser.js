const express = require("express");
const route = express.Router();
const { findUser, getAllUser } = require("../Controllers/finduser");

route.get("/users", getAllUser);
route.get("/:userId", findUser);

module.exports = route;
