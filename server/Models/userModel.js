const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxLength: 50 },
    email: { type: String, required: true, minlength: 3, maxlength: 200, unique: true },
    password: { type: String, required: true, minlength: 3, maxlength: 255 },
  },
  {
    timestamps: true,
  }
);
const userModel = mongoose.model("Users", userSchema);
module.exports = userModel;
