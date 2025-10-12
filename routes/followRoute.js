const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const followRoute = express.Router();

followRoute.post("/:followingId", async (req, res) => {
  const followerId = req.user.id;
  const followingId = parseInt(req.params.followingId);

  //check if user's id exists
  if (!followerId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // Validate followingId
  if (!followingId || isNaN(followingId)) {
    return res.status(400).json({ message: "Invalid following ID" });
  }
  //check if user wanna follow himsef/herself
  if (followerId === followingId) {
    const selfFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    // only delete if it exists
    if (selfFollow) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });
    }
    //dont forgoet to return so the function stops
    return res.status(400).json({ message: "Cannot followe yourself mehh" });
  }
  try {
    //check if user already following
    const existing = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: followingId,
        },
      },
    });
    if (existing) {
      // Already following → Unfollow
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId: followingId,
          },
        },
      });
      return res.json({ followed: false, message: "Unfollowed successfully" });
    } else {
      //let user follow
      await prisma.follows.create({
        data: {
          followerId: followerId,
          followingId: followingId,
        },
      });
      return res.json({ followed: true, message: "Followed successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
});
module.exports = followRoute;
