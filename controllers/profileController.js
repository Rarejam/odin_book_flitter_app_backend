const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const profileController = async (req, res) => {
  const { profileId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        //dont forget to parseInt the profileId to convert it to integer
        id: parseInt(profileId),
      },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        profileImage: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};
module.exports = profileController;
