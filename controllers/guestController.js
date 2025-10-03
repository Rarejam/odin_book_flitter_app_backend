const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const guestController = async (req, res) => {
  try {
    // find guest user
    let guestUser = await prisma.user.findUnique({
      where: { email: "guest@example.com" },
    });

    // if not found, create guest user with hashed password
    if (!guestUser) {
      const hashedPassword = await bcrypt.hash("guest_account", 10);
      guestUser = await prisma.user.create({
        data: {
          username: "Guest",
          email: "guest@example.com",
          bio: "I was too lazy to signup/login",
          password: hashedPassword,
        },
      });
    }

    // generate token for authorization
    const token = jwt.sign(
      { id: guestUser.id, email: guestUser.email }, // 👈 use id consistently
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Logged in as guest",
      token,
      user: {
        id: guestUser.id,
        username: guestUser.username,
        email: guestUser.email,
        bio: guestUser.bio,
      },
    });
  } catch (error) {
    console.error("Guest login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = guestController;
