import Comment from "../models/model.comments.js";

export const createComment = async (req, res) => {
  const { content, userId, postId } = req.body;
  try {
    if (!content || !userId || !postId) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const newComment = new Comment({
      content,
      userId,
      postId,
    });
    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const likeComment = async (req, res) => {
  try {
    // console.log("postId ,userId",req.params.postId,req.params.userId);
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.stauts(404).json({
        message: "comment not found",
      });
    }

    const index = comment.likes.indexOf(req.params.userId);
    if (index === -1) {
      comment.likes.push(req.params.userId);
    } else {
      comment.likes.splice(index, 1);
    }

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//delete comment
export const deleteComment = async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(
      req.params.commentId
    );
    res.status(200).json(deletedComment);
  } catch (error) {}
};

//edit comment
export const editComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({
        message: "comment not found",
      });
    }
    comment.content = req.body.content;
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
