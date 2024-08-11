const jwt = require("jsonwebtoken");

const createToken = (id) => {
  const jwtKey = process.env.JWT_SECRET_KEY;
  const accessToken = jwt.sign({ id }, jwtKey, {
    algorithm: "HS256",
    expiresIn: 3600,
  });
  return accessToken;
};

const verifyToken = (token) => {
  const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY, { algorithm: "HS256" });
};

module.exports = { createToken, verifyToken };
