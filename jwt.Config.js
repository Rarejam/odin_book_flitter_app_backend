const jwt = require("jsonwebtoken");
require("dotenv").config();

//create a middleware func to verify token from authorization req.headers
const verifyToken = async (req, res, next) => {
  // get token from authorization bearer header

  //   Authorization: Bearer <token>
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization token not found" });
  }
  // split the authHeader by space('add each element splitted into an array')
  //then get the second element which is the token('index 1')
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied token missing" });
  }
  //token gotten form req.headers should then be verified
  //   token,secretKey,and then a callback
  jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(401).json(err);
    }
    req.user = payload;
    next();
  });
};
module.exports = verifyToken;
