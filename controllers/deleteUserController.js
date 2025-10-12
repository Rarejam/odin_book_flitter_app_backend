const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { cloudinary } = require("../cloudinaryConfig");
const deleteUserController = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { profileImagePublicId: true },
    });

    if (!user) {
      return res.status(404).json("User not found");
    }
    //delete ptivate message chat
    await prisma.privateMessage.deleteMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    });
    // delete comments
    await prisma.comment.deleteMany({
      where: {
        authorId: userId,
      },
    });
    //delete posts
    await prisma.post.deleteMany({
      where: {
        authorId: userId,
      },
    });
    // Delete profile image from Cloudinary if it exists
    if (user.profileImagePublicId) {
      try {
        await cloudinary.uploader.destroy(user.profileImagePublicId);
        console.log(`Deleted Cloudinary image: ${user.profileImagePublicId}`);
      } catch (error) {
        console.warn(`Cloudinary deletion failed: ${error.message}`);
      }
    }

    //finally delete user
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
