const express = require("express");
const {
  privateMessageController,
  upload,
  cloudinary,
} = require("../controllers/privateMessageController");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const privateMessageRoute = express.Router();

privateMessageRoute.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const chatUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, username: true, profileImage: true },
    });

    const messages = await prisma.privateMessage.findMany({
      where: {
        //OR is for like a conditional statement and its just an array of objects

        OR: [
          { senderId: userId, receiverId: parseInt(id) },
          { senderId: parseInt(id), receiverId: userId },
        ],
      },
      include: {
        sender: { select: { id: true, username: true, profileImage: true } },
        receiver: { select: { id: true, username: true, profileImage: true } },
      },
      orderBy: { date: "asc" },
    });

    res.status(200).json({ chatUser, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
});

privateMessageRoute.post(
  "/:id",
  upload.single("text_image"),
  privateMessageController
);

// DELETE /api/user/text/:msgId
privateMessageRoute.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const message = await prisma.privateMessage.findUnique({
      where: { id: parseInt(id) },
    });

    if (!message || message.senderId !== userId) {
      return res.status(403).json("Not authorized to delete this message");
    }
    // delete image from Cloudinary if exists
    if (message.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(message.imagePublicId);
        console.log(`✅ Cloudinary image deleted: ${message.imagePublicId}`);
      } catch (error) {
        console.warn(`⚠️ Failed to delete Cloudinary image: ${error.message}`);
      }
    }

    await prisma.privateMessage.delete({ where: { id: parseInt(id) } });
    res.status(200).json("Message deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
});

module.exports = privateMessageRoute;
