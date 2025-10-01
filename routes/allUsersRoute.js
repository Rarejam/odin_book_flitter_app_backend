const allUsersController = require("../controllers/allUsersController");
const express = require("express");
const allUsersRoute = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

allUsersRoute.get("/", allUsersController);

allUsersRoute.get("/following", async (req, res) => {
  try {
    const following = await prisma.user.findMany({
      select: {
        following: {
          include: {
            id: true,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});
allUsersRoute.get("/followers", (req, res) => {});
module.exports = allUsersRoute;
