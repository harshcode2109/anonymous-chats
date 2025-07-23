import express from "express";
import { addFeedback } from "../controllers/feedback.controller.js";




const router = express.Router();
router.post("/createfeedback",addFeedback)





export default router;
