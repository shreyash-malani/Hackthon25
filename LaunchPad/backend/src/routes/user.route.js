import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { createFounderProfile, getMyFounderProfile, updateFounderProfile } from '../controllers/founder.controller.js';
import { createInvestorProfile, getMyInvestorProfile, updateInvestorProfile } from '../controllers/investor.controller.js';
import { createStartupProfile, dislikeStartup, getAllStartups, getMyStartupProfile, getStartupById, likeStartup, updateStartupProfile, saveStartup, getSavedStartups } from '../controllers/startup.controller.js';
import { upload } from '../utils/multerConfig.js';
import { getStats } from '../controllers/stats.controller.js';
import { createComment, getComments, addReply } from '../controllers/comment.controller.js';

const router = express.Router();
router.get('/stats', getStats);


router.post('/createFounderProfile', verifyToken, createFounderProfile);
router.get('/getMyFounderProfile', verifyToken, getMyFounderProfile);
router.put('/updateFounderProfile', verifyToken, updateFounderProfile);

router.post('/createInvestorProfile', verifyToken, createInvestorProfile);
router.get('/getMyInvestorProfile', verifyToken, getMyInvestorProfile);
router.put('/updateInvestorProfile', verifyToken, updateInvestorProfile);

router.post('/comments', verifyToken, createComment);
router.get('/comments/:startupId', verifyToken, getComments);
router.post('/comments/:commentId/reply', verifyToken, addReply);
// routes/startupRoutes.js

// Route to create a startup profile with file uploads

// For multiple named files (1 pdf and 1 pitch)
router.post('/startup', upload.fields([
  { name: 'startupPdf', maxCount: 1 },
  { name: 'pitch', maxCount: 1 }
]),verifyToken, createStartupProfile);



router.get('/getStartups', verifyToken, getAllStartups); // Get current startup profile

router.get('/getMyStartupProfile', verifyToken, getMyStartupProfile);

router.get('/getStartupById/:startupId', verifyToken, getStartupById);

router.put('/updateStartupProfile/:startupId', upload.fields([
  { name: 'startupPdf', maxCount: 1 },
  { name: 'pitch', maxCount: 1 }
]), verifyToken, updateStartupProfile);

router.post('/startup/like/:id', verifyToken, likeStartup);


router.post('/startup/dislike/:id', verifyToken, dislikeStartup);

router.post('/startup/save/:id', verifyToken, saveStartup);
router.get('/savedStartups', verifyToken, getSavedStartups);

export default router;