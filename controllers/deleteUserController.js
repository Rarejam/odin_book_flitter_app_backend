const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const deleteUserController = async (req, res) => {
  const userId = req.user.id;
  try {
    await prisma.comment.deleteMany({
      where: {
        authorId: userId,
      },
    });
    await prisma.post.deleteMany({
      where: {
        authorId: userId,
      },
    });
    await prisma.user.delete({
      where: { id: userId },
    });
    res.status(200).json("User Successfully Deleted");
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};
module.exports = deleteUserController;
