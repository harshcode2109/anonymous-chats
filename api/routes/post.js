import express from "express";
import { createPost, deletePost, getAllPosts, likePost,  } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/createpost",createPost);
router.get('/getallposts',getAllPosts);
router.put("/likepost/:postId/:userId",likePost);
router.delete('/deletepost/:postId',deletePost)


export default router;
