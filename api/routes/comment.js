import express from "express";
import {
  createComment,
  deleteComment,
  editComment,
  getComments,
  likeComment,
} from "../controllers/comment.controller.js";

const router = express.Router();
router.post("/createcomment", createComment);
router.get("/getcomments/:postId", getComments);
router.put("/likecomment/:commentId/:userId", likeComment);
router.delete("/deletecomment/:commentId", deleteComment);
router.put("/editcomment/:commentId", editComment);

export default router;
