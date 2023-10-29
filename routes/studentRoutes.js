import express from 'express'
import { requireSignIn, isTeacher } from '../middlewares/authMiddleware.js'
import { getAssignedStudents } from '../controllers/studentsController.js';
// create a new router
const router = express.Router();


// routing 
// get assigned students 
// here id is the id of teacher to whom students are assigned
router.get('/get-assigned-students', requireSignIn, isTeacher, getAssignedStudents)

export default router