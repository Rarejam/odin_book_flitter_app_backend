const userController = require("../controllers/userController");
const express = require("express");
const userRoute = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { upload, cloudinary } = require("../cloudinaryConfig");

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
        _count: {
          select: {
            reshares: true,
          },
        },
        // likes: true,
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
        _count: {
          select: {
            reshares: true,
          },
        },
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
//uplaod image
userRoute.post("/picture", upload.single("profile_image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userId = req.user.id;

    // 1. Check if user already has an image
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user && user.profileImagePublicId) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(user.profileImagePublicId);
    }

    // 2. Save new image
    const imageUrl = req.file.path; // Cloudinary URL
    const publicId = req.file.filename; // Cloudinary public_id

    await prisma.user.update({
      where: { id: userId },
      data: {
        profileImage: imageUrl,
        profileImagePublicId: publicId,
      },
    });

    res.status(200).json({ message: "Uploaded successfully", imageUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json("Internal Server Error");
  }
});

module.exports = userRoute;
