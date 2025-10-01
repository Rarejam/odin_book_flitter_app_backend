const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userController = async (req, res) => {
  try {
    const payload = req.user; //  gets this from the middleware jwtconfig
    if (!payload) {
      return res.status(400).json({ message: "no User Found" });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
      select: { id: true, username: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("UserController error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = userController;
