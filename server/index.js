const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./database");
const routers = require("./Routes");

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
};

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

connectDB.connect();

app.use("/api", routers);
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).send({ author: "Hao" });
});

const port = process.env.PORT || 3000;
app.listen(port, function (err) {
  if (err) {
    console.log("server error: " + err);
  }
  console.log("app listening on port " + port);
});
module.exports = app;
