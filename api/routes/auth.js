import express from "express";
import {
  forgotpassword,
  generateOTP,
  resetPassword,
  signin,
  signout,
  signup,
  verifyOTP,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/generateotp", generateOTP);
router.post("/verifyotp", verifyOTP);
router.post("/signin", signin);
router.post("/signout",signout);
router.post("/forgotpassword",forgotpassword);
router.post("/resetpassword",resetPassword);


export default router;
