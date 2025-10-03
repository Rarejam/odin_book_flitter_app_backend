const allUsersController = require("../controllers/allUsersController");
const express = require("express");
const allUsersRoute = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

allUsersRoute.get("/", allUsersController);

module.exports = allUsersRoute;
