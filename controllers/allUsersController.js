const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const allUsersController = async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        profileImage: true,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });

    res.status(200).json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server Error");
  }
};

module.exports = allUsersController;
