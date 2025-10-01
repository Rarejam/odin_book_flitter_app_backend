const guestController = require("../controllers/guestController");
const express = require("express");
const guestRoute = express.Router();

guestRoute.post("/", guestController);

module.exports = guestRoute;
