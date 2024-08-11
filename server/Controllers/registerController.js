const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { createToken } = require("../JWT");

const registerController = async (req, res) => {
  const { email, name, password } = req.body;
  if (email) {
    if (validator.isEmail(email)) {
      const userIsExsts = await userModel.findOne({ email });
      if (userIsExsts) {
        res.status(400).send({ message: "user email is already exists" });
      } else {
        if (!name || !password) {
          res.status(400).send({ message: "name and password is required" });
        } else {
          try {
            if (password.trim().length >= 6) {
              const newUser = new userModel({ email, name, password });
              const salt = await bcrypt.genSalt(10);
              pass = await bcrypt.hash(password, salt);
              newUser.password = pass;
              await newUser.save();
              const accessToken = createToken(newUser._id);
              res.send({ accessToken, message: "register successfully", name: newUser.name, id: newUser._id });
            } else {
              res.send({
                message: "passwords must be at least 6 characters",
              });
            }
          } catch (err) {
            res.send({ message: "server error please try again later" });
          }
        }
      }
    } else {
      res.status(400).send({ message: "invalid email" });
    }
  } else {
    res.status(400).send({ message: "email is required" });
  }
};

module.exports = { registerController };
