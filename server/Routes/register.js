const express = require("express");
const route = express.Router();
const { registerController } = require("../Controllers/registerController");

route.post("/", registerController);

module.exports = route;
