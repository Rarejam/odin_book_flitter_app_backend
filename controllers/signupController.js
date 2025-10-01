const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//try to do the auto login stuff
const signupController = async (req, res) => {
  try {
    const { username, email, password, confirm_password } = req.body;

    //check for existing user
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with email already exists" });
    }
    // check if passwords match
    if (password !== confirm_password) {
      return res.status(401).json({ message: "passwords do not match" });
    }
    //check password length
    if (password.length < 6) {
      return res.status(400).json({ message: "passowrd too short" });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  save user
    const user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
      },
    });

    //assign a token for AUTO-LOGIN
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });
    return res.status(201).json({ message: "signup successful", token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: `Internal Server Error : ${err} ` });
  }
};
module.exports = signupController;
