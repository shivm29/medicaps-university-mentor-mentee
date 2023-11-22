import express from 'express'
import { requireSignIn, isTeacher, isAdmin } from '../middlewares/authMiddleware.js'
import { assignMentorController, assignMentorToMultiple, getAnyStudentController, getAssignedStudents, getRangeStudents, getStudentDetails } from '../controllers/studentsController.js';

// create a new router
const router = express.Router();


// routing 
// get assigned students 
// here id is the id of teacher to whom students are assigned
router.get('/get-assigned-students', requireSignIn, isTeacher, getAssignedStudents)

router.get('/get-all-students', isAdmin, getAnyStudentController)


router.get('/get-any-student', isAdmin, getAnyStudentController)

router.get('/student-details/:id', isAdmin, getStudentDetails)

router.get('/student-details-by-teacher/:id', isTeacher, getStudentDetails)

// route to assign mentor to a student
router.put('/assign-mentor', isAdmin, assignMentorController)

// assign mentor to multiple
router.put('/assign-mentor-to-multiple', isAdmin, assignMentorToMultiple)

router.get('/range', getRangeStudents);

export default router