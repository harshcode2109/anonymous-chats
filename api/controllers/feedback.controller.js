import Feedback from "../models/model.feedback.js";

export const addFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newFeedback = new Feedback({ name, email, message });
    await newFeedback.save();
    res.status(200).json({ message: "Feedback added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
