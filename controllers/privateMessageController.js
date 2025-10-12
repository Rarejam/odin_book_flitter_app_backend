const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

//write multer config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
//write storage form
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "text_images", // name of folder to store in cloudinary
    allowed_formats: ["jpg", "png", "gif", "jpeg", "webp"], // restrict file types the image types that are allowed
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});
const upload = multer({ storage });

//write post controller
const privateMessageController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { newMsg } = req.body;
    let imageUrl = null;
    let imagePublicId = null;
    if (req.file) {
      imageUrl = req.file.path;
      imagePublicId = req.file.filename;
    }

    if ((!newMsg || newMsg.trim() === "") && !imageUrl) {
      return res.status(400).json("Message failed to send");
    }

    const message = await prisma.privateMessage.create({
      data: {
        senderId: userId,
        receiverId: parseInt(id),
        content: newMsg,
        chatImage: imageUrl,
        imagePublicId: imagePublicId || null,
      },
      include: {
        sender: { select: { id: true, username: true, profileImage: true } },
        receiver: { select: { id: true, username: true, profileImage: true } },
      },
    });

    return res.status(201).json(message);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};

module.exports = { privateMessageController, upload, cloudinary };
