const discoverController = require("../controllers/discoverController");
const express = require("express");
const discoverRoute = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

discoverRoute.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        comments: true,
        author: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    if (!posts || posts.length === 0) {
      return res.status(400).json({ message: "No posts available" });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});
discoverRoute.post("/", discoverController);

module.exports = discoverRoute;
