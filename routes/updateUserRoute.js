const updateUserController = require("../controllers/updateUserController");
const express = require("express");
const updateUserRoute = express.Router();
updateUserRoute.put("/", updateUserController);
module.exports = updateUserRoute;
