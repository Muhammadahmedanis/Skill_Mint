import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET_KEY, 
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        
        if (!fs.existsSync(localFilePath)) {
            console.log("File does not exist at:", localFilePath);
            return null;
        }

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image" // Fix: Correct "img" to "image"
        });

        // Delete the local file after successful upload
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);

        // Remove the local file if upload fails
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
}



export {uploadOnCloudinary}