const userController = require("../controllers/userController");
const express = require("express");
const userRoute = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET all users
userRoute.get("/", userController);

// GET posts of logged-in user
userRoute.get("/posts", async (req, res) => {
  try {
    const userId = req.user.id;

    const userPosts = await prisma.post.findMany({
      where: { authorId: userId },
      include: {
        author: {
          select: { id: true, username: true, email: true, profileImage: true },
        },
        comments: true,
        // likes: true,
        // shares: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(userPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// get comments of logged in user
userRoute.get("/comments", async (req, res) => {
  const userId = req.user.id;
  try {
    const comments = await prisma.comment.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: {
          select: { id: true, username: true, email: true, profileImage: true },
        },
      },

      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});
//get posts of users follwed by logged-in user
userRoute.get("/following", async (req, res) => {
  const userId = req.user.id;
  try {
    // Step 1: get list of userIds that the logged-in user follows
    const following = await prisma.follows.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = following.map((f) => f.followingId);

    // Step 2: fetch posts from those users
    const followingPosts = await prisma.post.findMany({
      where: {
        authorId: { in: followingIds },
      },
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

    res.status(200).json(followingPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
});
// get users the logged-in user follows
userRoute.get("/following-users", async (req, res) => {
  const userId = req.user.id;

  try {
    const following = await prisma.follows.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            email: true,
            profileImage: true,
            createdAt: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    // map to clean list of user objects
    const followingUsers = following.map((f) => f.following);

    res.status(200).json(followingUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
});
// get users the logged-in user's followers
userRoute.get("/follower-users", async (req, res) => {
  const userId = req.user.id;

  try {
    const follower = await prisma.follows.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            email: true,
            profileImage: true,
            createdAt: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    // map to clean list of user objects
    const followerUsers = follower.map((f) => f.follower);

    res.status(200).json(followerUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
});

module.exports = userRoute;
