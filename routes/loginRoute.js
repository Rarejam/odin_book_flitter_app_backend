const loginController = require("../controllers/loginController");
const express = require("express");
const loginRoute = express.Router();

loginRoute.get("/", (req, res) => {
  res.send("this is the login route lol");
});
loginRoute.post("/", loginController);
module.exports = loginRoute;
