import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';

export const createOrGetConversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        members: [senderId, receiverId],
      });
      await conversation.save();
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error('Error creating/fetching conversation:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



export const getUserConversations = async (req, res) => {
  const { userId } = req.params;

  try {
    const conversations = await Conversation.find({
      members: { $in: [userId] }
    })
      .populate('members', 'fullName email') // Populate member details
      .sort({ updatedAt: -1 }); // Sort by most recent activity

    // Fetch the latest message for each conversation
    const conversationsWithLatestMessage = await Promise.all(
      conversations.map(async (conversation) => {
        const latestMessage = await Message.findOne({ conversationId: conversation._id })
          .sort({ createdAt: -1 })
          .populate('sender', 'fullName');
        return { ...conversation.toObject(), latestMessage };
      })
    );

    res.status(200).json(conversationsWithLatestMessage);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching conversations', error: err.message });
  }
};
