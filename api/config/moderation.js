import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY; // Ensure this is set in .env

async function moderateImage(imageURL) {
  try {
    const request = {
      requests: [
        {
          image: { source: { imageUri: imageURL } },
          features: [{ type: "SAFE_SEARCH_DETECTION" }],
        },
      ],
    };

    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      request
    );

    const detections = response.data.responses[0].safeSearchAnnotation;

    if (
      detections.adult === "LIKELY" ||
      detections.adult === "VERY_LIKELY" ||
      detections.racy === "LIKELY" ||
      detections.racy === "VERY_LIKELY" ||
      detections.violence === "LIKELY" ||
      detections.violence === "VERY_LIKELY"
    ) {
      return { allowed: false, reason: "Inappropriate content detected." };
    }
    return { allowed: true };
  } catch (error) {
    console.error("Error analyzing image:", error.response?.data || error.message);
    return { allowed: false, reason: "Error processing image." };
  }
}

export default moderateImage;
