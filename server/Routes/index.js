const registerRoute = require("./register");
const loginRoute = require("./login");
const findUserRoute = require("./findUser");
const chatRoute = require("./chat");
const messageRoute = require("./message");

// const Router = (app) => {
//   app.use("/api/register", registerRoute);
// };

// module.exports = { Router };

const express = require("express");
const routes = express.Router();

routes.use("/register", registerRoute);
routes.use("/login", loginRoute);
routes.use("/findUser", findUserRoute);
routes.use("/chat", chatRoute);
routes.use("/message", messageRoute);
routes.use("/", (req, res) => {
  res.send("api working....");
});

module.exports = routes;
