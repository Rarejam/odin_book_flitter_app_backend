const signupController = require("../controllers/signupController");
const express = require("express");
const signupRoute = express.Router();

signupRoute.get("/", (req, res) => {
  res.send("this is the signup route na");
});

signupRoute.post("/", signupController);

module.exports = signupRoute;
