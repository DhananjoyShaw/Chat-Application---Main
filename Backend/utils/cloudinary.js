import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (fileBuffer, fileMimetype) => {
    try {
        if (!fileBuffer) return null;

        console.log("Attempting to upload file to Cloudinary");

        // Convert buffer to base64 string
        const fileBase64 = `data:${fileMimetype};base64,${fileBuffer.toString("base64")}`;

        // Upload the file on Cloudinary
        const response = await cloudinary.uploader.upload(fileBase64, {
            resource_type: "auto"
        });

        console.log("File uploaded to Cloudinary:", response.url);
        return response;

    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return null;
    }
};

export { uploadOnCloudinary };
