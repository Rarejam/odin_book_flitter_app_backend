const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const commentsController = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const newComment = await prisma.comment.create({
      data: {
        content: content,
        postId: parseInt(id),
        authorId: req.user?.id,
      },
      include: { author: true },
    });
    res.status(200).json(newComment);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};
module.exports = commentsController;
