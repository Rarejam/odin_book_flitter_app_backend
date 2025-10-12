const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const allUsersController = async (req, res) => {
  const userId = req.user.id;

  try {
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        profileImage: true,
        _count: {
          select: { followers: true, following: true },
        },
        followers: {
          where: { followerId: userId },
          select: { id: true },
        },
      },
    });

    // add 'followed' flag directly
    const usersWithFollowStatus = allUsers.map((user) => ({
      ...user,
      followed: user.followers.length > 0,
    }));

    res.json(usersWithFollowStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};

module.exports = allUsersController;
