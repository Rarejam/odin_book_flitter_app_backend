const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

const updateUserController = async (req, res) => {
  const { username, email, password, bio } = req.body;
  const userId = req.user.id;

  try {
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (bio) updateData.bio = bio;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields to update." });
    }
    const updatedUser = await prisma.user.update({
      data: updateData,
      where: {
        id: userId,
      },
    });
    res.status(200).json(updatedUser, { message: "Successfully Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};
module.exports = updateUserController;
