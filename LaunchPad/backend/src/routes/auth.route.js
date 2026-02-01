import express from 'express';
import { checkAuth, login, logout, signUp } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', logout);
router.get('/checkauth', verifyToken, checkAuth); // Middleware to verify token

export default router