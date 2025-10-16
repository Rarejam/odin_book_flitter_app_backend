const discoverController = require("../controllers/discoverController");
const express = require("express");
const discoverRoute = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { upload, cloudinary } = require("../postsCloudinaryConfig");

discoverRoute.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        comments: true,
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            profileImage: true,
            followers: {
              select: { followerId: true },
            },
          },
        },
        _count: {
          select: { reshares: true, likes: true },
        },
      },
      orderBy: { createdAt: "desc" },
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
discoverRoute.post("/", upload.single("post_image"), discoverController);

discoverRoute.delete("/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    //  Delete all likes linked to this post
    await prisma.postLike.deleteMany({
      where: { postId: parseInt(postId) },
    });
    //delet comments under post first
    await prisma.comment.deleteMany({
      where: {
        postId: parseInt(postId),
      },
    });

    // 2️⃣ Delete all reshares referencing this post
    await prisma.resharedPost.deleteMany({
      where: { postId: parseInt(postId) },
    });

    // 🖼️ 3️⃣ Delete Cloudinary image if it exists
    if (post.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(post.imagePublicId);
        console.log(`Cloudinary image deleted: ${post.imagePublicId}`);
      } catch (err) {
        console.warn(`Failed to delete Cloudinary image: ${err.message}`);
      }
    }

    //then delete post itself
    await prisma.post.delete({
      where: {
        id: parseInt(postId),
      },
    });
    res.status(200).json("Successfully deleted post and its comments");
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal sever Error");
  }
});
module.exports = discoverRoute;
