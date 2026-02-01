import { Message } from '../models/Message.js';
import { User } from '../models/User.js';

// Send a new message
import { Conversation } from '../models/Conversation.js';


export const sendMessage = async (req, res) => {
  try {
    const { conversationId, sender, text } = req.body;

    console.log('Incoming message data:', { conversationId, sender, text }); // Debugging

    if (!conversationId || !sender || !text) {
      return res.status(400).json({ message: 'conversationId, sender, and text are required' });
    }

    const message = new Message({
      conversationId,
      sender,
      content: text,
    });

    const savedMessage = await message.save();
    console.log('Saved message:', savedMessage); // Debugging

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


// Get all conversations for the current user
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all unique users the current user has chatted with
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { receiver: userId }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $last: '$content' },
          timestamp: { $last: '$timestamp' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$receiver', userId] },
                  { $eq: ['$read', false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: '$user._id',
          fullName: '$user.fullName',
          email: '$user.email',
          lastMessage: 1,
          timestamp: 1,
          unreadCount: 1
        }
      },
      {
        $sort: { timestamp: -1 }
      }
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get messages between two users
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    console.log('Fetched messages:', messages); // Debugging

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};