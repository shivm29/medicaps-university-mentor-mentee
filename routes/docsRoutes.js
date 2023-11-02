import express from 'express'
import { approveDocumentController, docsuploadController, getDocByIdConroller, getDocsByIDController, getDocsController } from '../controllers/docsController.js'
import ExpressFormidable from 'express-formidable';
import { isAdmin, isAssignedTeacher, isStudent, isTeacher, requireSignIn } from '../middlewares/authMiddleware.js';

// create a new router
const router = express.Router();

// upload documents | POST
router.post('/upload-docs', requireSignIn, isStudent, ExpressFormidable(), docsuploadController);

// student retrieves his/her documents
// here :id is the id of student
router.get('/get-docs', requireSignIn, getDocsController)

router.get('/get-doc/:id', requireSignIn, getDocByIdConroller)



// teacher retrieve student's document
router.get('/get-student-docs/:id', requireSignIn, isTeacher, isAssignedTeacher, getDocsByIDController)

router.put('/approve-doc', requireSignIn, isTeacher, approveDocumentController)


// get documents associated to a student by student id
router.get('/student-documents/:id', isAdmin, getDocsByIDController)



export default router