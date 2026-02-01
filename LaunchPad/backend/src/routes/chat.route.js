import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import {
  createOrGetConversation,
  getUserConversations
} from '../controllers/conversation.controller.js';

import {
  sendMessage,
  getMessages
} from '../controllers/message.controller.js';

const router = express.Router();

// routes/conversationRoutes.js
router.post('/conversations', verifyToken, createOrGetConversation);
router.get('/conversations/:userId', verifyToken, getUserConversations);

// routes/messageRoutes.js
router.post('/message', verifyToken, sendMessage);
router.get('/messages/:conversationId', verifyToken, getMessages);

export default router;
