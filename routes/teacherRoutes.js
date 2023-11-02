import express from 'express'
import { requireSignIn, isAdmin, isTeacher } from '../middlewares/authMiddleware.js'
import { getAnyTeacherController, getMentorController } from '../controllers/teacherController.js';

// create a new router
const router = express.Router();

// routing 
router.get('/get-any-teacher', requireSignIn, isAdmin, getAnyTeacherController)

router.get('/get-mentor/:id', isAdmin, getMentorController)


export default router