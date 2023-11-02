import express from 'express'
import { isStudent, isTeacher } from '../middlewares/authMiddleware.js';
import { handleCreateMeetingController, handleGetMeetingByStudentController, handleGetMeetingController } from '../controllers/meetingsController.js';

const router = express.Router();

router.post('/create-meeting', isTeacher, handleCreateMeetingController);

router.get('/get-meetings', handleGetMeetingController)

router.get('/get-meetings-by-students', handleGetMeetingByStudentController)

export default router