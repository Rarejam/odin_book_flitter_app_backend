const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const loginController = async (req, res) => {
  //get details form forntend
  const { email, password } = req.body;

  //   check for details
  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  try {
    // find user using details from db
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    // if no details,return err
    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    //comapare details password with db password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    // assign jwt token for authorizaion
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    // return success message with a response and a token and THE user obj
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.log("login error", err);
    res.status(500).json({ message: "Internal server error" });
  }

  console.log("this is the login controller lol");
};
module.exports = loginController;
