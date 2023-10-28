import express from 'express'
import { docsuploadController, getDocsController } from '../controllers/docsController.js'
import ExpressFormidable from 'express-formidable';
import { isAssignedTeacher, isStudent, isTeacher, requireSignIn } from '../middlewares/authMiddleware.js';

// create a new router
const router = express.Router();

// upload documents | POST
router.post('/upload-docs', requireSignIn, isStudent, ExpressFormidable(), docsuploadController);

// student retrieves his/her documents
// here :id is the id of student
router.get('/get-docs/:id', requireSignIn, getDocsController)

// teacher retrieve student's document
router.get('/get-student-docs/:id', requireSignIn, isTeacher, isAssignedTeacher, getDocsController)

export default router