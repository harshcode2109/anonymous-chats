import Post from "../models/model.posts.js";

import moderateImage from "../config/moderation.js";
import analyzeText from "../config/analyzeText.js";

//create post
export const createPost = async (req, res) => {
  try {
    const { title, content, image } = req.body.formData;
    const { author, userId } = req.body;

    console.log(req.body);

    if (!title || !content) {
      return res.status(400).json({
        message: "Title, content and author are required",
      });
    }
    const post = await Post.findOne({ title });
    if (post) {
      return res.status(409).json({
        message: "Post with this title already exists",
      });
    }
    const slug = req.body.formData.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    if (image) {
      const moderationResult = await moderateImage(image);
      console.log(moderationResult);
      if (!moderationResult.allowed) {
        return res.status(400).json({
          message: "Image moderation failed",
        });
      }
    }

    //for title

    const titleModerationResult = await analyzeText(title);

    if (titleModerationResult === null) {
      return res.status(500).json({ message: "Failed to analyze text" });
    }

    if (titleModerationResult > 0.7) {
      return res
        .status(401)
        .json({ message: "Title contains too many offensive words" });
    }

    //for description

    const contentModerationResult = await analyzeText(content);

    if (contentModerationResult === null) {
      return res.status(500).json({ message: "Failed to analyze text" });
    }

    if (contentModerationResult > 0.7) {
      return res
        .status(402)
        .json({ message: "content contains too many offensive words" });
    }

    const newPost = new Post({
      title,
      content,
      author,
      image,
      slug,
      userId,
    });

    await newPost.save();
    res.status(200).json({
      message: "post created succesfully",
      newPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//getAllpost

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      message: "post fetched successfully",
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//like post

export const likePost = async (req, res) => {
  try {
    // console.log("postId ,userId",req.params.postId,req.params.userId);
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.stauts(404).json({
        message: "post not found",
      });
    }

    const index = post.likes.indexOf(req.params.userId);
    if (index === -1) {
      post.likes.push(req.params.userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({
        message: "post does not exist",
      });
    }
    const deletedPost = await Post.findByIdAndDelete(req.params.postId);

    res.status(200).json(deletedPost);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
