import Comment from "../models/Comment.js";

export const createComment = async (req, res) => {
  try {
    const { startupId, content } = req.body;
    const userId = req.user._id;

    const comment = new Comment({
      startupId,
      userId,
      content
    });

    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'fullName')
      .exec();

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const { startupId } = req.params;
    const comments = await Comment.find({ startupId })
      .populate('userId', 'fullName')
      .populate('replies.userId', 'fullName')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    comment.replies.push({
      userId,
      content
    });
    
    await comment.save();
    
    const updatedComment = await Comment.findById(commentId)
      .populate('userId', 'fullName')
      .populate('replies.userId', 'fullName');
    
    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};