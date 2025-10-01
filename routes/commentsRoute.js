const commentsController = require("../controllers/commentsController");
const express = require("express");
const commentRoute = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//get comments for a specific post
// GET post and its comments
commentRoute.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: { id: true, username: true, email: true, profileImage: true },
        },
        comments: {
          include: {
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
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post with comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//create a comment on a specific post
commentRoute.post("/:id", commentsController);
module.exports = commentRoute;
