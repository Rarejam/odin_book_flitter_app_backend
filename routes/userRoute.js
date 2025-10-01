const userController = require("../controllers/userController");
const express = require("express");
const userRoute = express.Router();
userRoute.get("/", userController);
module.exports = userRoute;
