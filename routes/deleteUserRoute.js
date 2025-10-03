const deleteUserController = require("../controllers/deleteUserController");
const express = require("express");
const deleteUserRoute = express.Router();
deleteUserRoute.delete("/", deleteUserController);
module.exports = deleteUserRoute;
