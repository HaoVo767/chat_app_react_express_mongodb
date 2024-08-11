const mongoose = require("mongoose");

function connect() {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("connection successful");
    })
    .catch((err) => {
      throw new Error("connection error: " + err.message);
    });
}

module.exports = { connect };
