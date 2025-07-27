import dotenv from "dotenv";
dotenv.config();

import axios from "axios";

const PERSPECTIVE_API_URL =
  "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze";

const analyzeText = async (text) => {
  try {
    const response = await axios.post(
      `${PERSPECTIVE_API_URL}?key=${process.env.PERSPECTIVE_API_KEY}`,
      {
        comment: { text: text },
        languages: ["en"],
        requestedAttributes: { TOXICITY: {} },
      }
    );

    return response.data.attributeScores.TOXICITY.summaryScore.value;
  } catch (error) {
    console.error(
      "Error analyzing text:",
      error.response?.data || error.message
    );
    return null;
  }
};

export default analyzeText;
