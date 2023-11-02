import express from 'express'
import { isTeacher } from '../middlewares/authMiddleware.js';
import { handleCreateMeetingController } from '../controllers/meetingsController.js';

const router = express.Router();

router.post('/create-meeting', isTeacher, handleCreateMeetingController);

export default router