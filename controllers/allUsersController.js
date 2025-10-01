const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const allUsersController = async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany();
    if (!allUsers) {
      res.status(400).json({ message: "POST works!" });
    }
    res.status(200).json(allUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server Error");
  }
};
module.exports = allUsersController;
