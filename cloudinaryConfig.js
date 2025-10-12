require("dotenv").config();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

//youll drop yr cloudinary details here
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//craeting tje storage pbj
const storage = new CloudinaryStorage({
  cloudinary, //in cloudinary
  params: {
    folder: "profile_picture", // name of folder to store in cloudinary
    allowed_formats: ["jpg", "png", "gif", "jpeg", "webp"], // restrict file types the image types that are allowed
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});
const upload = multer({ storage });

module.exports = { cloudinary, upload };
