const express = require("express");
const reshareRoute = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ✅ Get all reshared posts by logged-in user
reshareRoute.get("/user/reshared", async (req, res) => {
  const userId = req.user.id;
  try {
    const reshared = await prisma.resharedPost.findMany({
      where: { userId },
      include: {
        post: {
          include: {
            author: true,
            comments: true,
            _count: {
              select: { reshares: true },
            },
          },
        },
      },
    });

    // Flatten response so frontend gets a list of posts
    const resharedPosts = reshared.map((r) => r.post);
    res.status(200).json(resharedPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load reshared posts" });
  }
});

// ✅ Toggle reshare (reshare or unshare)
reshareRoute.post("/post/:postId", async (req, res) => {
  const userId = req.user.id;
  const postId = parseInt(req.params.postId);

  try {
    const existing = await prisma.resharedPost.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      await prisma.resharedPost.delete({
        where: { userId_postId: { userId, postId } },
      });
      return res
        .status(200)
        .json({ reshared: false, message: "Unshared post" });
    }

    const reshare = await prisma.resharedPost.create({
      data: { userId, postId },
    });

    res.status(200).json({ reshared: true, reshare });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = reshareRoute;
