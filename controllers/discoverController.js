const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const discoverController = async (req, res) => {
  const imageUrl = req.file ? req.file.path : null;
  const userId = req.user.id;
  const { content } = req.body;
  try {
    if (!content && !req.file) {
      return res.status(400).json({ error: "Post must have text or an image" });
    }

    const imagePublicId = req.file ? req.file.filename : null;

    // if image uploaded, Cloudinary URL will be at req.file.path
    const post = await prisma.post.create({
      data: {
        content,
        postImage: imageUrl,
        imagePublicId,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            username: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

module.exports = discoverController;
