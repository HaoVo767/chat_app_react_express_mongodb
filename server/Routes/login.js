const express = require("express");
const route = express.Router();
const { loginController } = require("../Controllers/login");

route.post("/", loginController);

module.exports = route;
