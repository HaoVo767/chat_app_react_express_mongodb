const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const { createToken } = require("../JWT");

const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send({ message: "email or password is incorrect" });
  } else {
    try {
      const user = await userModel.findOne({ email });
      if (user) {
        const isCorrectPass = await bcrypt.compare(password, user.password);
        if (isCorrectPass) {
          const token = createToken(user._id);
          res.status(200).send({ message: "login successful", token, name: user.name, id: user._id });
        } else {
          res.status(400).send({ message: "password incorrect" });
        }
      } else {
        res.status(400).send({ message: "user dose not exist" });
      }
    } catch {
      res.status(400).send({ message: "error" });
    }
  }
};

module.exports = { loginController };
