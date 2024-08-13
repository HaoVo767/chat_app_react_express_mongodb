const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./database");
// const { Router } = require("./Routes");
const routers = require("./Routes");

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connectDB.connect();
// Router(app);
app.use("/api", routers);
app.get("/", (req, res) => {
  res.send("api working");
});
const port = process.env.PORT || 3000;
app.listen(port, function (err) {
  if (err) {
    console.log("server error: " + err);
  }
  console.log("app listening on port " + port);
});

module.exports = app;
