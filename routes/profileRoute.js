const profileController = require("../controllers/profileController");
const express = require("express");
const profileRoute = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//get user profile
profileRoute.get("/:profileId", profileController);

// get user profile's posts
profileRoute.get("/:profileId/posts", async (req, res) => {
  const { profileId } = req.params;

  try {
    const posts = await prisma.post.findMany({
      where: { authorId: parseInt(profileId) },
      include: {
        author: {
          select: { id: true, username: true, email: true, profileImage: true },
        },
        comments: true,
        // likes: true, // add later if you have likes model
      },
      orderBy: {
        createdAt: "desc", // newest first
      },
    });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get user profile's comments
profileRoute.get("/:profileId/comments", async (req, res) => {
  const { profileId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { authorId: parseInt(profileId) },
      include: {
        author: {
          select: { id: true, username: true, email: true, profileImage: true },
        },
      },

      orderBy: { createdAt: "desc" },
    });

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get user profile's follwing's posts
profileRoute.get("/:profileId/following/posts", async (req, res) => {
  const { profileId } = req.params;

  try {
    const following = await prisma.follows.findMany({
      where: { followerId: parseInt(profileId) },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);

    const posts = await prisma.post.findMany({
      where: { authorId: { in: followingIds } },
      select: {
        id: true,
        content: true,
        postImage: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            profileImage: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = profileRoute;
