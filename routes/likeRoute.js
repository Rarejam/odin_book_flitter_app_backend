const express = require("express");
const likeRoute = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

likeRoute.post("/post/:postId", async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  //   const user = await prisma.user.findUnique({ where: { id: userId } });
  try {
    const existing = await prisma.postLike.findUnique({
      where: { postId_userId: { postId: parseInt(postId), userId } },
    });
    if (existing) {
      await prisma.postLike.delete({
        where: { postId_userId: { postId: parseInt(postId), userId } },
      });
      return res.status(200).json({ liked: false, message: "post unliked" });
    }
    await prisma.postLike.create({
      data: { userId, postId: parseInt(postId) },
    });
    res.status(200).json({ liked: true, message: "post liked" });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});

likeRoute.post("/comment/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const existing = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId: parseInt(commentId),
          userId,
        },
      },
    });

    if (existing) {
      await prisma.commentLike.delete({
        where: {
          commentId_userId: {
            commentId: parseInt(commentId),
            userId,
          },
        },
      });
      return res.status(200).json({ liked: false, message: "Comment unliked" });
    }

    await prisma.commentLike.create({
      data: { userId, commentId: parseInt(commentId) },
    });

    res.status(200).json({ liked: true, message: "Comment liked" });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});
module.exports = likeRoute;
