const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const discoverController = async (req, res) => {
  try {
    const { content } = req.body; // renamed to match frontend
    const userId = req.user.id; // <- comes from JWT middleware after login

    if (!content) {
      return res.status(400).json({ message: "Post content is required" });
    }

    // create post
    const newPost = await prisma.post.create({
      data: {
        content,
        authorId: userId,
      },
      include: {
        author: {
          select: { username: true, email: true },
        },
        comments: true,
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = discoverController;
