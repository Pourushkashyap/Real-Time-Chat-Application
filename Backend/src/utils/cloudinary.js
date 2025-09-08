import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const uploadoncloudinary = async (localfilepath) => {
  try {
    if (!localfilepath) return null;

    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
      folder: "avatar",
    });

    // delete temp file
    fs.unlink(localfilepath, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });

    return response;
  } catch (err) {
    if (fs.existsSync(localfilepath)) {
      fs.unlinkSync(localfilepath);
    }
    console.log("file is not uploaded to cloudinary", err);
    return null;
  }
};

export { uploadoncloudinary };
